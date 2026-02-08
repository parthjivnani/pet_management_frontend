import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userFirstName");
  localStorage.removeItem("userLastName");
}

export function getRole(): string | null {
  return localStorage.getItem("userRole");
}

export function setRole(role: string) {
  localStorage.setItem("userRole", role);
}

export function getUserNames(): {
  firstName: string | null;
  lastName: string | null;
} {
  return {
    firstName: localStorage.getItem("userFirstName"),
    lastName: localStorage.getItem("userLastName"),
  };
}

export function setUserNames(firstName: string, lastName: string) {
  localStorage.setItem("userFirstName", firstName);
  localStorage.setItem("userLastName", lastName);
}

/**
 * Formats the options for the dropdown
 * @param data The data to format
 * @param valueFrom The name of the field to format
 * @param labelFrom The name of the field to format
 * @returns The formatted options
 */
export function formattedOptions(
  data: any,
  valueFrom: string,
  labelFrom: string,
) {
  let formattedOptions = [];
  formattedOptions = data?.map((item: any) => ({
    value: item[valueFrom] ?? "",
    label: item[labelFrom] ?? "",
  }));
  return formattedOptions;
}
