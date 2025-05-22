function downloadPDF(blob, reportName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}

export default downloadPDF;