import { useState } from "react";

export const useForm = (initialObj = {}) => {

  //hook para cuando se llena el formulario
  const [form, setForm] = useState(initialObj);

  // Método que toma el valor de los campos del formulario y los setea en la cariable de estado form
  const changed = ({target}) => {
    const {name, value} = target;

    setForm({
      ...form,
      [name]: value
    });
  };

  return {
    form,
    changed
  }
};