// File upload endpoint
import { readMultipartFormData } from 'h3'
import { parseFile } from '../utils/fileParser'
import type { FileUploadResponse, UploadedFile } from '~/types/file'

// In-memory storage for uploaded files (in production, use database)
const uploadedFiles = new Map<string, UploadedFile>()

export default defineEventHandler(async (event): Promise<FileUploadResponse> => {
  console.log('📥 Upload API called')
  try {
    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    console.log('📦 FormData parsed, items:', formData?.length || 0)

    if (!formData || formData.length === 0) {
      console.log('❌ No form data')
      return {
        success: false,
        error: 'No file provided'
      }
    }

    // Get the first file from form data
    const fileData = formData.find(item => item.filename)
    console.log('📄 File data found:', fileData?.filename, 'size:', fileData?.data?.length)

    if (!fileData || !fileData.filename || !fileData.data) {
      console.log('❌ Invalid file data')
      return {
        success: false,
        error: 'Invalid file data'
      }
    }

    // Get dataType from form data (optional)
    const dataTypeField = formData.find(item => item.name === 'dataType')
    const dataType = dataTypeField?.data?.toString() || 'other'
    console.log('📋 DataType:', dataType)

    // Parse file content
    console.log('🔍 Parsing file...')
    const parseResult = await parseFile(
      fileData.data,
      fileData.filename,
      fileData.type || 'application/octet-stream'
    )
    console.log('📝 Parse result:', parseResult.success, parseResult.error || 'no error')

    if (!parseResult.success) {
      console.log('❌ Parse failed:', parseResult.error)
      return {
        success: false,
        error: parseResult.error || 'File parsing failed'
      }
    }

    // Create uploaded file record
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: fileData.filename,
      size: fileData.data.length,
      type: fileData.type || 'application/octet-stream',
      dataType: dataType as 'textbook' | 'roleplay' | 'other',
      extractedText: parseResult.text,
      uploadedAt: new Date()
    }
    console.log('✅ File record created:', fileId)

    // Store in memory (in production, save to database)
    uploadedFiles.set(fileId, uploadedFile)

    console.log('✅ Upload complete, returning success')
    return {
      success: true,
      file: uploadedFile
    }
  } catch (error) {
    console.error('❌ File upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File upload failed'
    }
  }
})

// Export uploadedFiles for other endpoints to access
export { uploadedFiles }
