export function callbacks<T>() {
  let handlers: T[] = [];

  function add(handler: T): () => void {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i !== -1) handlers.splice(i, 1);
    };
  }

  function reset() {
    handlers = [];
  }

  return {
    add,
    reset,
    list: () => [...handlers],
  };
}
