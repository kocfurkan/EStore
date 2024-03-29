import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

// Test purpose delay for loading component
const delay = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.MODE === "development") await delay();

    const pagination = response.headers["pagination"];

    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }

    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("Unauthorized Action");
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params: params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios.post(url, data, {
      headers: { "Content-type": "multipart/form-data" },
    }),
  putForm: (url: string, data: FormData) =>
    axios.post(url, data, {
      headers: { "Content-type": "multipart/form-data" },
    }),
};

function createFormData(item: any) {
  let formData = new FormData();

  for (const key in item) {
    formData.append(key, item[key]);
  }

  return formData;
}

const Admin = {
  createProduct: (product: any) =>
    requests.postForm("products", createFormData(product)).then(responseBody),
  updateProduct: (product: any) =>
    requests.putForm("products", createFormData(product)).then(responseBody),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  getFilters: () => requests.get("products/filters"),
};

// Test
const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Cart = {
  get: () => requests.get("cart"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`cart?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`cart?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  fetchAddress: () => requests.get("account/savedAddress"),
};

const Orders = {
  list: () => requests.get("orders"),
  fetch: (id: number) => requests.get(`orders/${id}`),
  create: (values: any) => requests.post(`orders`, values),
};

const Payments = {
  createPaymentIntent: () => requests.post("payments", {}),
};

const agent = {
  TestErrors,
  Catalog,
  Cart,
  Account,
  Orders,
  Payments,
  Admin,
};

export default agent;
