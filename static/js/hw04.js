function createHTMLElement(withHtml) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = withHtml;
    return tempElement.firstElementChild
}