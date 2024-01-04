import * as yup from "yup";

export const validationSchme = [
  //Even though not validating the review component we should add an empty yup object to it.
  yup.object({
    fullName: yup.string().required("Full name is required"),
    address1: yup.string().required("Address 1 is required"),
    address2: yup.string().required("Address 2 is required"),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    country: yup.string().required(),
  }),
  yup.object(),
  yup.object({
    nameOnCard: yup.string().required(),
  }),
];
