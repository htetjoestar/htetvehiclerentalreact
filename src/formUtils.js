export function handleInputChange(setState) {
    return function (e) {
      const { name, value, type, checked } = e.target;
      setState(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  }