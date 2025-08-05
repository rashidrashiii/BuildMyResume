import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Edit3, Save, Undo, Redo } from "lucide-react";

interface ResumePreviewProps {
  data: any;
  TemplateComponent: React.ComponentType<any>;
  isEditing?: boolean;
  editableContent?: string;
  setEditableContent?: (html: string) => void;
  onSave?: (content: string) => void;
  zoom?: number;
  setZoom?: (z: number) => void;
  pageCount?: number;
  setPageCount?: (n: number) => void;
  showZoomControls?: boolean;
  containerClassName?: string;
  secureExportRef?: React.RefObject<HTMLDivElement>;
  rightControls?: React.ReactNode;
}

interface HistoryState {
  content: string;
  timestamp: number;
}

const baseWidth = 794; // A4 width px
const baseHeight = 1123; // A4 height px
const pagePadding = 0; // Padding inside each page
const pageGap = 24; // Gap between pages

export const ResumePreview = ({
  data,
  TemplateComponent,
  isEditing = false,
  editableContent = "",
  setEditableContent,
  onSave,
  zoom: zoomProp,
  setZoom: setZoomProp,
  pageCount: pageCountProp,
  setPageCount: setPageCountProp,
  showZoomControls = true,
  containerClassName = "",
  secureExportRef,
  rightControls,
}: ResumePreviewProps) => {
  const [zoom, setZoom] = useState(zoomProp ?? 1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pageCount, setPageCount] = useState(pageCountProp ?? 1);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  
  const containerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const historyTimeoutRef = useRef<NodeJS.Timeout>();
  const isUndoRedoRef = useRef(false);

  // Local state for uncontrolled editing
  const [localContent, setLocalContent] = useState(editableContent || '<div><br></div>');

  // Add mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync zoom/pageCount with props if provided
  useEffect(() => {
    if (typeof zoomProp === "number") setZoom(zoomProp);
  }, [zoomProp]);
  useEffect(() => {
    if (typeof setZoomProp === "function") setZoomProp(zoom);
  }, [zoom, setZoomProp]);
  useEffect(() => {
    if (typeof pageCountProp === "number") setPageCount(pageCountProp);
  }, [pageCountProp]);
  useEffect(() => {
    if (typeof setPageCountProp === "function") setPageCountProp(pageCount);
  }, [pageCount, setPageCountProp]);

  // Initialize history when editing starts
  useEffect(() => {
    if (isEditing && history.length === 0) {
      const initialState: HistoryState = {
        content: editableContent || '<div><br></div>',
        timestamp: Date.now()
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [isEditing, editableContent, history.length]);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    if (!editableRef.current) return null;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    const startMarker = document.createElement('span');
    const endMarker = document.createElement('span');
    startMarker.id = 'cursor-start-marker';
    endMarker.id = 'cursor-end-marker';
    startMarker.style.display = 'none';
    endMarker.style.display = 'none';
    
    try {
      const clonedRange = range.cloneRange();
      clonedRange.collapse(false);
      clonedRange.insertNode(endMarker);
      
      range.collapse(true);
      range.insertNode(startMarker);
      
      return { startMarker, endMarker };
    } catch (e) {
      startMarker.remove();
      endMarker.remove();
      return null;
    }
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((markers: { startMarker: HTMLElement; endMarker: HTMLElement } | null) => {
    if (!markers || !editableRef.current) return;
    
    try {
      const { startMarker, endMarker } = markers;
      const selection = window.getSelection();
      if (!selection) return;
      
      if (startMarker.parentNode && endMarker.parentNode) {
        const range = document.createRange();
        range.setStartAfter(startMarker);
        range.setEndBefore(endMarker);
        
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      startMarker.remove();
      endMarker.remove();
    } catch (e) {
      try {
        markers.startMarker.remove();
        markers.endMarker.remove();
      } catch {
        // Ignore cleanup errors
      }
    }
  }, []);

  // Clean HTML content
  const cleanContent = useCallback((html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const svgElements = tempDiv.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('data-preserve', 'true');
    });
    
    const emptyElements = tempDiv.querySelectorAll('*:not([data-preserve])');
    emptyElements.forEach(el => {
      if (
        el.textContent?.trim() === '' &&
        (el.tagName === 'U' || (el as HTMLElement).style.textDecoration?.includes('underline'))
      ) {
        el.remove();
      }
    });
    
    const cleanEmptyElements = (element: Element) => {
      Array.from(element.children).forEach(child => {
        if (child.hasAttribute('data-preserve')) return;
        cleanEmptyElements(child);
        if (
          child.textContent?.trim() === '' &&
          child.children.length === 0 &&
          !['BR', 'IMG', 'HR'].includes(child.tagName)
        ) {
          child.remove();
        }
      });
    };
    
    cleanEmptyElements(tempDiv);
    
    svgElements.forEach(svg => {
      svg.removeAttribute('data-preserve');
    });
    
    return tempDiv.innerHTML;
  }, []);

  // Add to history
  const addToHistory = useCallback((content: string) => {
    if (isUndoRedoRef.current) return;
    
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }
    
    historyTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        const newState: HistoryState = {
          content: cleanContent(content),
          timestamp: Date.now()
        };
        newHistory.push(newState);
        
        if (newHistory.length > 50) {
          return newHistory.slice(-50);
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, 500);
  }, [historyIndex, cleanContent]);

  // Enhanced page calculation with accurate measurement
  const calculateRequiredPages = useCallback(() => {
    if (!editableRef.current && !data) return;

    // Create measurement container with same styles
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = `${baseWidth}px`;
    tempDiv.style.padding = `${pagePadding}px`;
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.5';
    tempDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    tempDiv.style.boxSizing = 'border-box';

    // Use appropriate content based on editing state
    if (isEditing && editableRef.current) {
      tempDiv.innerHTML = editableRef.current.innerHTML;
    } else if (data.editedHtml) {
      tempDiv.innerHTML = data.editedHtml;
    } else {
      // For template changes, we need to render the template component
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${baseWidth}px`;
      tempContainer.style.padding = `${pagePadding}px`;
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.5';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      tempContainer.style.boxSizing = 'border-box';
      
      document.body.appendChild(tempContainer);
      
      // Create a React root and render the template
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(tempContainer);
        root.render(<TemplateComponent data={data} />);
        
        // Wait for render to complete
        setTimeout(() => {
          tempDiv.innerHTML = tempContainer.innerHTML;
          
          // Remove trailing <br> tags
          while (tempDiv.lastChild && tempDiv.lastChild.nodeName === 'BR') {
            tempDiv.removeChild(tempDiv.lastChild);
          }

          document.body.appendChild(tempDiv);
          
          // Calculate total content height including padding
          const contentHeight = tempDiv.scrollHeight + (pagePadding * 2);
          document.body.removeChild(tempDiv);
          document.body.removeChild(tempContainer);
          root.unmount();

          const requiredPages = Math.max(1, Math.ceil(contentHeight / baseHeight));

          if (requiredPages !== pageCount) {
            setPageCount(requiredPages);
            if (setPageCountProp) {
              setPageCountProp(requiredPages);
            }
          }
        }, 100);
      }).catch(() => {
        // Fallback if React DOM client import fails
        document.body.removeChild(tempContainer);
        const requiredPages = Math.max(1, Math.ceil((tempContainer.offsetHeight + (pagePadding * 2)) / baseHeight));
        if (requiredPages !== pageCount) {
          setPageCount(requiredPages);
          if (setPageCountProp) {
            setPageCountProp(requiredPages);
          }
        }
      });
      
      return;
    }

    // Remove trailing <br> tags
    while (tempDiv.lastChild && tempDiv.lastChild.nodeName === 'BR') {
      tempDiv.removeChild(tempDiv.lastChild);
    }

    document.body.appendChild(tempDiv);
    
    // Calculate total content height including padding
    const contentHeight = tempDiv.scrollHeight + (pagePadding * 2);
    document.body.removeChild(tempDiv);

    const requiredPages = Math.max(1, Math.ceil(contentHeight / baseHeight));

    if (requiredPages !== pageCount) {
      setPageCount(requiredPages);
      if (setPageCountProp) {
        setPageCountProp(requiredPages);
      }
    }
  }, [pageCount, setPageCountProp, isEditing, data]);

  // Fit to width
  const fitToWidth = (containerWidth: number) => {
    const padding = 40;
    const availableWidth = containerWidth - padding;
    const newZoom = Math.min(availableWidth / baseWidth, 1);
    setZoom(newZoom);
  };

  // Initialize with fit-to-width
  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      setTimeout(() => {
        fitToWidth(containerRef.current!.offsetWidth);
        setIsInitialized(true);
        if (isEditing) {
          setTimeout(calculateRequiredPages, 100); // Initial page calculation
        }
      }, 100);
    }
  }, [isInitialized, isEditing, calculateRequiredPages]);

  // Watch for template/data changes and recalculate pages
  useEffect(() => {
    if (isInitialized && !isEditing) {
      // Add a small delay to ensure the template has rendered
      const timeoutId = setTimeout(() => {
        calculateRequiredPages();
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [data, TemplateComponent, isInitialized, isEditing, calculateRequiredPages]);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.2));
  const handleResetZoom = () => setZoom(1);
  const handleFitToWidth = () => {
    if (containerRef.current) fitToWidth(containerRef.current.offsetWidth);
  };

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0 && editableRef.current) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      
      const markers = saveCursorPosition();
      editableRef.current.innerHTML = prevState.content;
      if (setEditableContent) {
        setEditableContent(prevState.content);
      }
      setHistoryIndex(newIndex);
      setHasUnsavedChanges(true);
      
      setTimeout(() => {
        restoreCursorPosition(markers);
        isUndoRedoRef.current = false;
        calculateRequiredPages();
      }, 50);
    }
  }, [historyIndex, history, setEditableContent, calculateRequiredPages, saveCursorPosition, restoreCursorPosition]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1 && editableRef.current) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      const markers = saveCursorPosition();
      editableRef.current.innerHTML = nextState.content;
      if (setEditableContent) {
        setEditableContent(nextState.content);
      }
      setHistoryIndex(newIndex);
      setHasUnsavedChanges(true);
      
      setTimeout(() => {
        restoreCursorPosition(markers);
        isUndoRedoRef.current = false;
        calculateRequiredPages();
      }, 50);
    }
  }, [historyIndex, history, setEditableContent, calculateRequiredPages, saveCursorPosition, restoreCursorPosition]);

  // Save
  const handleSave = useCallback(() => {
    if (editableRef.current) {
      const currentContent = cleanContent(editableRef.current.innerHTML);
      setEditableContent?.(currentContent);
      setLocalContent(currentContent);
      onSave?.(currentContent);
      setHasUnsavedChanges(false);
    }
  }, [setEditableContent, onSave, cleanContent]);

  // Content change handler
  const handleContentChange = useCallback(() => {
    if (!editableRef.current || isUndoRedoRef.current) return;
    const newContent = editableRef.current.innerHTML;
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      calculateRequiredPages();
      addToHistory(newContent);
    }, 300); // Reduced debounce time for faster page updates
  }, [calculateRequiredPages, addToHistory]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const br = document.createElement('br');
      
      range.deleteContents();
      range.insertNode(br);
      
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
      
      setTimeout(() => {
        handleContentChange();
        calculateRequiredPages();
      }, 10);
    }
  }, [handleContentChange, calculateRequiredPages]);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const lines = text.split(/\r?\n/);
    let lastNode = null;
    
    lines.forEach((line, index) => {
      if (index > 0) {
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        lastNode = br;
      }
      
      if (line) {
        const textNode = document.createTextNode(line);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        lastNode = textNode;
      }
    });
    
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    setTimeout(() => {
      handleContentChange();
      calculateRequiredPages();
    }, 10);
  }, [handleContentChange, calculateRequiredPages]);

  // Auto-scroll to cursor when new pages are created
  useEffect(() => {
    if (isEditing && scrollContainerRef.current && editableRef.current) {
      // Wait for DOM to update before scrolling
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const cursorNode = range.startContainer;
          
          if (cursorNode.nodeType === Node.TEXT_NODE || cursorNode.nodeType === Node.ELEMENT_NODE) {
            const element = cursorNode.nodeType === Node.TEXT_NODE 
              ? cursorNode.parentElement 
              : cursorNode as HTMLElement;
            
            if (element) {
              // Calculate position relative to scroll container
              const elementRect = element.getBoundingClientRect();
              const containerRect = scrollContainerRef.current!.getBoundingClientRect();
              
              // Scroll if cursor is near bottom of visible area
              if (elementRect.bottom > containerRect.bottom - 50) {
                scrollContainerRef.current!.scrollTop += elementRect.bottom - containerRect.bottom + 50;
              }
            }
          }
        }
      }, 100);
    }
  }, [pageCount, isEditing]);

  // Multi-page support
  const pages = Array.from({ length: pageCount }, (_, index) => index);

  // Focus on edit mode
  useEffect(() => {
    if (isEditing && editableRef.current) {
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.focus();
          calculateRequiredPages(); // Recalculate on focus
        }
      }, 100);
    }
  }, [isEditing, calculateRequiredPages]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEditing) return;
    
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            } else {
              e.preventDefault();
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isEditing, handleUndo, handleRedo, handleSave]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    };
  }, []);

  // Update effect to set innerHTML when isEditing or editableContent changes
  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.innerHTML = editableContent || '<div><br></div>';
    }
     
  }, [isEditing, editableContent]);



  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {showZoomControls && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg border">
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0" disabled={zoom <= 0.2}>
            <ZoomOut className="h-4 w-4 text-foreground" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0" disabled={zoom >= 3}>
            <ZoomIn className="h-4 w-4 text-foreground" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom} className="h-8 px-3 text-xs font-medium text-foreground">
            {Math.round(zoom * 100)}%
          </Button>
          <Button variant="outline" size="sm" onClick={handleFitToWidth} className="h-8 w-8 p-0" title="Fit to width">
            <Maximize2 className="h-4 w-4 text-foreground" />
          </Button>
          
          {isEditing && (
            <>
              <div className="w-px h-6 bg-border mx-1" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUndo} 
                className="h-8 w-8 p-0" 
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4 text-foreground" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRedo} 
                className="h-8 w-8 p-0" 
                disabled={historyIndex >= history.length - 1}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4 text-foreground" />
              </Button>
              {onSave && (
                <Button 
                  variant={hasUnsavedChanges ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleSave} 
                  className="h-8 px-3 text-xs font-medium"
                  title="Save (Ctrl+S)"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {hasUnsavedChanges ? "Save*" : "Save"}
                </Button>
              )}
            </>
          )}
          
          <div className="ml-auto flex items-center gap-2">
            {pageCount > 0 && !(isEditing && isMobile) && (
              <span className="text-xs text-muted-foreground px-2">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            )}
            {rightControls}
          </div>
        </div>
      )}
      
      <div
        ref={containerRef}
        className="flex-1 bg-gray-100 rounded-lg border overflow-auto resume-preview-container"
        style={{ minHeight: '400px' }}
      >
        <div className="p-8 flex flex-col items-center gap-6" style={{ width: 'fit-content', minWidth: '100%' }}>
          {isEditing || isMobile ? (
            <div
              className="bg-white shadow-lg rounded-sm relative"
              style={{ 
                width: baseWidth * zoom, 
                height: 'auto', // Changed from fixed height to auto
                flexShrink: 0,
                overflow: 'visible', // Changed from auto to visible
              }}
              ref={scrollContainerRef}
            >
              <div className="absolute -top-6 left-0 text-xs text-muted-foreground" style={{ fontSize: '10px' }}>
                Editable Resume (Multi-page)
              </div>
              <div style={{ 
                width: baseWidth * zoom, 
                height: 'auto', // Changed from fixed height to auto
                overflow: 'visible', // Changed from auto to visible
                position: 'relative' 
              }}>
                <div style={{ 
                  width: baseWidth, 
                  height: 'auto', // Changed from minHeight to auto height
                  transform: `scale(${zoom})`, 
                  transformOrigin: 'top left', 
                  position: 'relative',
                  background: 'white',
                  boxSizing: 'border-box',
                }}>
                  {/* Visual page breaks - positioned based on actual content height */}
                  {pageCount > 1 && [...Array(pageCount - 1)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: baseHeight * (i + 1),
                        left: '20px',
                        right: '20px',
                        borderTop: '3px dashed #9ca3af', // gray-400
                        zIndex: 20,
                        pointerEvents: 'none',
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        padding: '0 8px',
                        color: '#6b7280', // gray-500
                        fontSize: '12px',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: '600',
                      }}>
                        Page {i + 2}
                      </span>
                    </div>
                  ))}
                                    <div
                    style={{
                      position: 'relative',
                      width: baseWidth,
                      minHeight: baseHeight,
                      padding: `${pagePadding}px`,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxSizing: 'border-box',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {isEditing ? (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        ref={editableRef}
                        className="editable-resume-content"
                        style={{
                          outline: 'none',
                          cursor: 'text',
                          wordWrap: 'break-word',
                          whiteSpace: 'pre-wrap',
                          overflow: 'visible',
                          caretColor: '#000',
                          WebkitUserSelect: 'text',
                          userSelect: 'text',
                        }}
                        onInput={handleContentChange}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          // Ensure we have focus
                          if (editableRef.current) {
                            const selection = window.getSelection();
                            if (!selection || selection.rangeCount === 0) {
                              const range = document.createRange();
                              range.selectNodeContents(editableRef.current);
                              range.collapse(false);
                              selection?.removeAllRanges();
                              selection?.addRange(range);
                            }
                          }
                        }}
                        onBlur={() => {
                          if (editableRef.current && setEditableContent) {
                            const currentContent = editableRef.current.innerHTML;
                            const newContent = cleanContent(currentContent);
                            if (newContent !== currentContent) {
                              const markers = saveCursorPosition();
                              editableRef.current.innerHTML = newContent;
                              restoreCursorPosition(markers);
                            }
                            setEditableContent(newContent);
                            setLocalContent(newContent);
                            if (newContent !== editableContent) {
                              setHasUnsavedChanges(true);
                            }
                            calculateRequiredPages();
                          }
                        }}
                      >
                        {editableContent ? (
                          <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                        ) : data.editedHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: data.editedHtml }} />
                        ) : (
                          <TemplateComponent data={data} />
                        )}
                      </div>
                    ) : (
                      <div>
                        {editableContent ? (
                          <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                        ) : data.editedHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: data.editedHtml }} />
                        ) : (
                          <TemplateComponent data={data} />
                        )}
                      </div>
                    )}
                  </div>
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: baseWidth,
                      height: baseHeight * pageCount, // This creates the visual page boundary
                      border: '2px dashed #3b82f6',
                      borderRadius: '2px',
                      pointerEvents: 'none',
                      zIndex: 15,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            pages.map((pageIndex) => (
              <div
                key={pageIndex}
                className="bg-white shadow-lg rounded-sm relative"
                style={{ 
                  width: baseWidth * zoom, 
                  height: baseHeight * zoom, 
                  flexShrink: 0,
                  marginBottom: pageIndex < pageCount - 1 ? `${pageGap * zoom}px` : 0
                }}
              >
                <div className="absolute -top-6 left-0 text-xs text-muted-foreground" style={{ fontSize: '10px' }}>
                  Page {pageIndex + 1}
                </div>
                <div style={{ 
                  width: baseWidth * zoom, 
                  height: baseHeight * zoom, 
                  overflow: 'hidden', 
                  position: 'relative' 
                }}>
                  <div style={{ 
                    width: baseWidth, 
                    height: baseHeight, 
                    transform: `scale(${zoom})`, 
                    transformOrigin: 'top left', 
                    position: 'relative' 
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: -pageIndex * (baseHeight + pageGap), 
                      left: 0, 
                      width: baseWidth, 
                      minHeight: baseHeight, 
                      backgroundColor: 'white' 
                    }}>
                      <div style={{ 
                        width: baseWidth, 
                        minHeight: baseHeight, 
                        padding: `${pagePadding}px`, 
                        fontSize: '14px', 
                        lineHeight: '1.5', 
                        fontFamily: 'system-ui, -apple-system, sans-serif', 
                        boxSizing: 'border-box' 
                      }}>
                        {isEditing && editableContent ? (
                          <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                        ) : data.editedHtml ? (
                          <div dangerouslySetInnerHTML={{ __html: data.editedHtml }} />
                        ) : (
                          <TemplateComponent data={data} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};