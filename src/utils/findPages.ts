// Utility function to estimate A4 pages (copied from Editor)
export const estimateA4PagesFromFullHtml = (htmlString: string) => {
    // A4 dimensions: 8.27" x 11.69"
    // Puppeteer default margins: ~0.4" on all sides
    // Available content height: 11.69" - (2 * 0.4") = 10.89" = 1045px at 96dpi
    const A4_HEIGHT_PX = 1045; // Account for Puppeteer's default margins
    return new Promise<number>((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '0';
        iframe.style.width = '794px'; // A4 width
        iframe.style.height = 'auto';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
        iframe.onload = () => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) throw new Error("Failed to access iframe document");
                const totalHeight = iframeDoc.body.scrollHeight;
                document.body.removeChild(iframe);
                const pageCount = Math.ceil(totalHeight / A4_HEIGHT_PX);
                resolve(pageCount);
            } catch (err) {
                reject(err);
            }
        };
        iframe.srcdoc = htmlString;
    });
};