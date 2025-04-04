export function createElement(tag, options = {}) {
  const classNames = options.classNames || [];
  const children = options.children || [];
  const textContent =
    options.textContent !== undefined ? options.textContent : 0;
  const onClick = options.onClick || 0;
  const onChange = options.onChange || 0;
  const value = options.value;

  const element = document.createElement(tag);

  classNames.forEach((_, i) => {
    element.classList.add(classNames[i]);
  });

  children.forEach((_, i) => {
    element.append(children[i]);
  });

  if (textContent) element.textContent = textContent;
  if (onClick) element.addEventListener("click", onClick);
  if (onChange) element.addEventListener("change", onChange);
  if (value !== undefined) element.value = value;

  return element;
}
