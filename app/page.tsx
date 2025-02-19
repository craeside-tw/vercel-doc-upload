"use client"

import { LayoutDashboard, FileText, BookOpen, FileSearch, LifeBuoy, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUploadArea } from "@/components/file-upload-area"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileItem {
  id: string
  name: string
  clientName: string | null
  status: "UPLOADING" | "PROCESSING" | "READY" | "ERROR"
  progress?: number
  previewUrl?: string
}

export default function AnalyzePage() {
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()

  React.useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles))
    }
  }, [])

  const handleFileUpload = React.useCallback((uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      clientName: null,
      status: "UPLOADING",
      progress: 0,
      previewUrl: URL.createObjectURL(file),
    }))

    setFiles((prev) => {
      const updatedFiles = [...newFiles, ...prev]
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
      return updatedFiles
    })

    // Simulate file upload progress
    newFiles.forEach((newFile) => {
      const interval = setInterval(() => {
        setFiles((prev) => {
          const updatedFiles = prev.map((f) => {
            if (f.id === newFile.id) {
              const progress = (f.progress || 0) + 10
              if (progress >= 100) {
                clearInterval(interval)
                return { ...f, status: "PROCESSING", progress: undefined }
              }
              return { ...f, progress }
            }
            return f
          })
          localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
          return updatedFiles
        })
      }, 300)

      // Set status to READY after 2 seconds of processing
      setTimeout(() => {
        setFiles((prev) => {
          const updatedFiles = prev.map((f) => {
            if (f.id === newFile.id) {
              return { ...f, status: "READY" }
            }
            return f
          })
          localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
          return updatedFiles
        })
      }, 5000) // 3 seconds for upload + 2 seconds for processing
    })
  }, [])

  const filteredFiles = React.useMemo(() => {
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.clientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
    )
  }, [files, searchQuery])

  const assignClient = React.useCallback((fileId: string, clientName: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.map((f) => (f.id === fileId ? { ...f, clientName } : f))
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
      return updatedFiles
    })
  }, [])

  const handleRowClick = (fileId: string) => {
    router.push(`/file/${fileId}`)
  }

  return (
    <div className="flex h-screen bg-[#f7f5f3]">
      {/* Sidebar */}
      <div className="w-64 bg-[#262429] text-white flex flex-col fixed h-full">
        {/* Profile section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4365a8] rounded flex items-center justify-center text-sm">FS</div>
            <div>
              <div className="font-medium">Francis Sinatra</div>
              <div className="text-sm text-gray-400">Northwestern Mutual</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <FileText className="mr-3 h-4 w-4" />
              Purchases
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <BookOpen className="mr-3 h-4 w-4" />
              Resources
            </Button>
            <Button variant="secondary" className="w-full justify-start bg-[#4365a8] text-white hover:bg-[#4c71b8]">
              <FileSearch className="mr-3 h-4 w-4" />
              Analyze
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
              <LifeBuoy className="mr-3 h-4 w-4" />
              Support
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <header className="bg-white h-14 flex items-center justify-between px-4 border-b sticky top-0 z-10">
          <div className="text-xl font-bold">trust&will</div>
          <Button variant="ghost" className="text-gray-600">
            My Account
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2 font-serif">Analyze an image</h1>
            <p className="text-gray-600 mb-8">
              Upload your client's image and get quick insights without needing manual analysis.
            </p>

            {/* Upload area */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <FileUploadArea onFileUpload={handleFileUpload} />

              {/* Files section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium font-serif">Files</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search"
                      className="pl-9 w-64 rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Files table */}
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left font-medium text-gray-500 border-b border-gray-200">
                        <th className="px-4 py-2 w-12"></th>
                        <th className="px-4 py-2 w-1/3">FILE NAME</th>
                        <th className="px-4 py-2 w-1/4">CLIENT NAME</th>
                        <th className="px-4 py-2 w-1/4">STATUS</th>
                        <th className="px-4 py-2 w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr
                          key={file.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                          onClick={() => handleRowClick(file.id)}
                        >
                          <td className="px-4 py-2">
                            <div className="w-8 h-8 rounded overflow-hidden">
                              {file.previewUrl && (
                                <img
                                  src={file.previewUrl || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded"
                                  style={{ borderRadius: "2px" }}
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate max-w-[200px]">{file.name}</div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs">
                                  {file.name}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="px-4 py-2">
                            {file.clientName ? (
                              <span>{file.clientName}</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const name = prompt("Enter client name:")
                                  if (name) assignClient(file.id, name)
                                }}
                                className="text-[#4365a8] hover:underline"
                              >
                                Assign
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {file.status === "UPLOADING" && (
                              <div className="flex items-center gap-2">
                                <span
                                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded uppercase"
                                  style={{ borderRadius: "4px" }}
                                >
                                  UPLOADING
                                </span>
                                <span className="text-xs text-gray-500">{file.progress}%</span>
                              </div>
                            )}
                            {file.status === "PROCESSING" && (
                              <span
                                className="px-2 py-0.5 text-xs font-medium bg-[#E6E6FA] text-[#4365a8] rounded uppercase"
                                style={{ borderRadius: "4px" }}
                              >
                                PROCESSING
                              </span>
                            )}
                            {file.status === "READY" && (
                              <span
                                className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-600 rounded uppercase"
                                style={{ borderRadius: "4px" }}
                              >
                                READY
                              </span>
                            )}
                            {file.status === "ERROR" && (
                              <span
                                className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded uppercase"
                                style={{ borderRadius: "4px" }}
                              >
                                ERROR
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {file.status === "READY" && (
                              <button
                                className="text-[#4365a8] hover:underline font-bold"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/file/${file.id}`)
                                }}
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

