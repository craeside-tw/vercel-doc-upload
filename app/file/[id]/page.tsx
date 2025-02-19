"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface FileItem {
  id: string
  name: string
  clientName: string | null
  status: "UPLOADING" | "READY" | "ERROR"
  progress?: number
  previewUrl?: string
}

export default function FileDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = params.id as string
  const [file, setFile] = useState<FileItem | null>(null)

  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      const files: FileItem[] = JSON.parse(storedFiles)
      const foundFile = files.find((f) => f.id === fileId)
      if (foundFile) {
        setFile(foundFile)
      } else {
        // File not found, redirect to main page
        router.push("/")
      }
    } else {
      // No files stored, redirect to main page
      router.push("/")
    }
  }, [fileId, router])

  const handleDelete = () => {
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      const files: FileItem[] = JSON.parse(storedFiles)
      const updatedFiles = files.filter((f) => f.id !== fileId)
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
    }
    router.push("/")
  }

  if (!file) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <Link href="/" className="text-[#4365a8] hover:underline">
            &larr; Back to files
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-4">File Details</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p>
              <strong>File Name:</strong> {file.name}
            </p>
            <p>
              <strong>Client Name:</strong> {file.clientName || "Not assigned"}
            </p>
            <p>
              <strong>Status:</strong> {file.status}
            </p>
            <p>
              <strong>File ID:</strong> {file.id}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <img
              src={file.previewUrl || "/placeholder.svg"}
              alt={file.name}
              className="w-full max-w-md rounded-lg shadow-sm"
            />
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <Button className="bg-[#4365a8] text-white hover:bg-[#4c71b8]">Download File</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete File
          </Button>
        </div>
      </div>
    </div>
  )
}

