import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string().required("User Name is required").min(5, "Min 5 characters").max(20,"Maximum 20 Character or less"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});


export const UserRegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Shopkeeper name is required"),
  username: Yup.string().min(3, "Too Short!").max(30, "Too Long!").required("Username is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
  storeName: Yup.string().required("Store name is required"),
  ownerName: Yup.string().required("Owner name is required"),
  storeType: Yup.string().required("Store type is required"),
  phone: Yup.string().min(11, "Too Short!").max(13, "Too Long!").required("Phone is required"),
 
  address: Yup.string().required("Address is required"),
});