/* eslint-disable @typescript-eslint/no-explicit-any */
// services/appwriteFileAndDocService.ts
import { Client, Databases, Storage } from "appwrite";
import {
  createDocument,
  fetchDocuments,
  updateDocument,
  deleteDocument,
  getSingleDocument,
} from "./methods"; // تأكد من مسار الملف

// تهيئة عميل Appwrite
export const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID as string);

// خدمات التخزين والبيانات
export const storage = new Storage(client);
export const databases = new Databases(client);

// ثوابت الباكت والـ Collections
const FILE_BUCKET = import.meta.env.VITE_APPWRITE_FILE_BUCKET_ID as string;
const REPORTS_COL = import.meta.env.VITE_APPWRITE_REPORTE_COL_ID as string;
const INVOICES_COL = import.meta.env.VITE_APPWRITE_INVOICE_COL_ID as string;
const FARMS_COL   = import.meta.env.VITE_APPWRITE_FARMS_COL_ID as string

export type OnSuccessCreate = (newId: string) => void;
export type OnSuccessUpload = (fileId: string) => void;
export type OnSuccessSimple = () => void;
export type OnSuccessFetch = (docs: any[]) => void;
export type OnError = (error?: any) => void;

/**
 * fileService
 *  - upload:      رفع ملف (صورة، PDF، XLSX)
 *  - getPreview:  رابط معاينة داخلية
 *  - download:    رابط تحميل مباشر
 */
export const fileService = {
  upload: (file: File, onSuccess: OnSuccessUpload, onError: OnError) => {
    storage.createFile(FILE_BUCKET,'unique()', file)
      .then(res => onSuccess(res.$id))
      .catch(err => onError(err));
  },
  getFile: async (fileId: string) => storage.getFile(FILE_BUCKET, fileId),
  getPreview: (fileId: string) => storage.getFilePreview(FILE_BUCKET, fileId),
  download: (fileId: string) => storage.getFileDownload(FILE_BUCKET, fileId),
};

/**
 * reportsService
 *  - list:    جلب جميع التقارير
 *  - create:  إنشاء تقرير جديد (مع رفع الملفات أولاً)
 *  - update:  تحديث تقرير (رفع ملفات جديدة ودمجها)
 *  - delete:  حذف تقرير
 *  - getById: جلب تقرير واحد
 */
export const reportsService = {
  list: (onSuccess: OnSuccessFetch, onError: OnError, queries?: string[]) =>
    fetchDocuments(REPORTS_COL, onSuccess, onError, queries),

  create: (
    data: any,
    files: File[],
    onSuccess: OnSuccessUpload,
    onError: OnError
  ) => {
    Promise.all(
      files.map(
        file => new Promise<string>((resolve, reject) => {
          fileService.upload(file, resolve, reject);
        })
      )
    )
      .then(ids => createDocument(REPORTS_COL, { ...data, fileIds: ids }, onSuccess, onError))
      .catch(onError);
  },

  update: (
    documentId: string,
    data: any,
    files: File[],
    onSuccess: OnSuccessSimple,
    onError: OnError
  ) => {
    const existing = Array.isArray(data.fileIds) ? data.fileIds : [];
    Promise.all(
      files.map(
        file => new Promise<string>((resolve, reject) => {
          fileService.upload(file, resolve, reject);
        })
      )
    )
      .then(newIds =>
        updateDocument(
          REPORTS_COL,
          documentId,
          { ...data, fileIds: [...existing, ...newIds] },
          onSuccess,
          onError
        )
      )
      .catch(onError);
  },

  delete: (documentId: string, onSuccess: OnSuccessSimple) =>
    deleteDocument(REPORTS_COL, documentId, onSuccess),

  getById: (documentId: string) =>
    getSingleDocument(REPORTS_COL, documentId),
};

/**
 * invoiceService
 *  - list:    جلب جميع الفواتير
 *  - create:  إنشاء فاتورة جديدة (مع رفع الملفات)
 *  - update:  تحديث فاتورة
 *  - delete:  حذف فاتورة
 *  - getById: جلب فاتورة واحدة
 */
export const invoiceService = {
  list: (onSuccess: OnSuccessFetch, onError: OnError, queries?: string[]) =>
    fetchDocuments(INVOICES_COL, onSuccess, onError, queries),

  create: (
    data: any,
    files: File[],
    onSuccess: OnSuccessUpload,
    onError: OnError
  ) => {
    Promise.all(
      files.map(
        file => new Promise<string>((resolve, reject) => {
          fileService.upload(file, resolve, reject);
        })
      )
    )
      .then(ids => createDocument(INVOICES_COL, { ...data, fileIds: ids }, onSuccess, onError))
      .catch(onError);
  },

  update: (
    documentId: string,
    data: any,
    files: File[],
    onSuccess: OnSuccessSimple,
    onError: OnError
  ) => {
    const existing = Array.isArray(data.fileIds) ? data.fileIds : [];
    Promise.all(
      files.map(
        file => new Promise<string>((resolve, reject) => {
          fileService.upload(file, resolve, reject);
        })
      )
    )
      .then(newIds =>
        updateDocument(
          INVOICES_COL,
          documentId,
          { ...data, fileIds: [...existing, ...newIds] },
          onSuccess,
          onError
        )
      )
      .catch(onError);
  },

  delete: (documentId: string, onSuccess: OnSuccessSimple) =>
    deleteDocument(INVOICES_COL, documentId, onSuccess),

  getById: (documentId: string) =>
    getSingleDocument(INVOICES_COL, documentId),
};

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