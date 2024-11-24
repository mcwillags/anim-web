import axios from "axios";
import { APIContants } from "@constants";

const instance = axios.create({
  baseURL: APIContants.baseURL,
});

export default instance;

