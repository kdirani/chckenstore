/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, Account, Databases } from "appwrite";
import {
  createDocument,
  fetchDocuments,
  updateDocument,
  deleteDocument,
  getSingleDocument,
} from './methods'; // adjust this path if needed

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID

export const account = new Account(client);
export const databases = new Databases(client);

const REPORTS_COL = import.meta.env.VITE_APPWRITE_REPORTE_COL_ID as string
const INVOICES_COL = import.meta.env.VITE_APPWRITE_INVOICE_COL_ID as string
const FARMS_COL   = import.meta.env.VITE_APPWRITE_FARMS_COL_ID as string

export type OnSuccessCreate = (newId: string) => void
export type OnSuccessSimple = () => void
export type OnSuccessFetch = (docs: any[]) => void
export type OnError = () => void

/**
 * reportsService
 *  - list:    fetch all reports (optionally with queries)
 *  - create:  create a new report
 *  - update:  update an existing report
 *  - delete:  delete a report by ID
 */
export const reportsService = {
  list: (
    onSuccess: OnSuccessFetch,
    onError: OnError,
    queries?: string[]
  ) => {
    return fetchDocuments(REPORTS_COL, onSuccess, onError, queries)
  },

  create: (
    data: any,
    onSuccess: OnSuccessCreate,
    onError: OnError
  ) => {
    return createDocument(REPORTS_COL, data, onSuccess, onError)
  },

  update: (
    documentId: string,
    data: any,
    onSuccess: OnSuccessSimple,
    onError?: OnError
  ) => {
    return updateDocument(REPORTS_COL, documentId, data, onSuccess, onError)
  },

  delete: (
    documentId: string,
    onSuccess: OnSuccessSimple
  ) => {
    return deleteDocument(REPORTS_COL, documentId, onSuccess)
  },

  /**
   * (optional) fetch a single report by its ID
   */
  getById: async (documentId: string) => {
    return getSingleDocument(REPORTS_COL, documentId)
  }
}

/**
 * invoiceService
 *  - list:    fetch all invoices
 *  - create:  create a new invoice
 *  - update:  update an existing invoice
 *  - delete:  delete an invoice by ID
 */
export const invoiceService = {
  list: (
    onSuccess: OnSuccessFetch,
    onError: OnError,
    queries?: string[]
  ) => {
    return fetchDocuments(INVOICES_COL, onSuccess, onError, queries)
  },

  create: (
    data: any,
    onSuccess: OnSuccessCreate,
    onError: OnError
  ) => {
    return createDocument(INVOICES_COL, data, onSuccess, onError)
  },

  update: (
    documentId: string,
    data: any,
    onSuccess: OnSuccessSimple,
    onError?: OnError
  ) => {
    return updateDocument(INVOICES_COL, documentId, data, onSuccess, onError)
  },

  delete: (
    documentId: string,
    onSuccess: OnSuccessSimple
  ) => {
    return deleteDocument(INVOICES_COL, documentId, onSuccess)
  },

  /**
   * (optional) fetch a single invoice by its ID
   */
  getById: async (documentId: string) => {
    return getSingleDocument(INVOICES_COL, documentId)
  }
}

/**
 * farmsService
 *  - list:    fetch all farms
 *  - create:  create a new farm
 *  - update:  update an existing farm
 *  - delete:  delete a farm by ID
 */
export const farmsService = {
  list: (
    onSuccess: OnSuccessFetch,
    onError: OnError,
    queries?: string[]
  ) => {
    return fetchDocuments(FARMS_COL, onSuccess, onError, queries)
  },

  create: (
    data: any,
    onSuccess: OnSuccessCreate,
    onError: OnError
  ) => {
    return createDocument(FARMS_COL, data, onSuccess, onError)
  },

  update: (
    documentId: string,
    data: any,
    onSuccess: OnSuccessSimple,
    onError?: OnError
  ) => {
    return updateDocument(FARMS_COL, documentId, data, onSuccess, onError)
  },

  delete: (
    documentId: string,
    onSuccess: OnSuccessSimple
  ) => {
    return deleteDocument(FARMS_COL, documentId, onSuccess)
  },

  /**
   * (optional) fetch a single farm by its ID
   */
  getById: async (documentId: string) => {
    return getSingleDocument(FARMS_COL, documentId)
  }
}
