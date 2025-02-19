"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  onFileUpload: (files: File[]) => void
  className?: string
}

export function FileUploadArea({ onFileUpload, className }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      if (files.length > 0) {
        onFileUpload(files)
      } else {
        alert("Please upload image files only")
      }
    },
    [onFileUpload],
  )

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files).filter((file) => file.type.startsWith("image/")) : []
      if (files.length > 0) {
        onFileUpload(files)
      } else {
        alert("Please upload image files only")
      }
    },
    [onFileUpload],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-200 rounded-lg p-12 text-center transition-all duration-200 ease-in-out cursor-pointer",
        isDragging && "border-[#4365a8] bg-blue-50/50",
        isHovering && "border-[#4365a8] bg-[#E6E6FA]/50",
        !isDragging && !isHovering && "bg-[#E6E6FA]/20",
        className,
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} multiple />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out",
            isHovering ? "bg-[#4365a8]" : "bg-blue-50",
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6 transition-colors duration-200 ease-in-out",
              isHovering ? "text-white" : "text-[#4365a8]",
            )}
          />
        </div>
        <div className={cn("text-gray-600 transition-colors duration-200 ease-in-out", isHovering && "text-[#4365a8]")}>
          Drag and drop images or <span className="text-[#4365a8] hover:underline">select files</span>
        </div>
      </div>
    </div>
  )
}

