// Utility function to estimate A4 pages (copied from Editor)
export const estimateA4PagesFromFullHtml = (htmlString: string) => {
    const A4_HEIGHT_PX = 1123; // 11.69in * 96dpi
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