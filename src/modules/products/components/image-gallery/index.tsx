"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "@medusajs/icons"
import type { KeyboardEvent } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleThumbnailClick = (index: number) => {
    setIsLoading(true)
    setCurrentImageIndex(index)
  }

  const handlePrevImage = useCallback(() => {
    setIsLoading(true)
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNextImage = useCallback(() => {
    setIsLoading(true)
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      handlePrevImage()
    } else if (e.key === "ArrowRight") {
      handleNextImage()
    } else if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false)
    } else if (e.key === "+" || e.key === "=") {
      handleZoomIn()
    } else if (e.key === "-") {
      handleZoomOut()
    }
  }, [handlePrevImage, handleNextImage, isFullscreen])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handleZoomIn = () => {
    if (scale < 3) {
      setScale(prev => prev + 0.5)
    }
  }

  const handleZoomOut = () => {
    if (scale > 1) {
      setScale(prev => prev - 0.5)
      // Reset position if we're back to scale 1
      if (scale <= 1.5) {
        setPosition({ x: 0, y: 0 })
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setScale(2.5)
    }
  }

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscKey as any)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey as any)
    }
  }, [isFullscreen])

  // Reset zoom and position when closing fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isFullscreen])

  // No images case
  if (!images.length) {
    return (
      <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle">
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-ui-fg-subtle">No images available</p>
        </div>
      </Container>
    )
  }

  return (
    <>
      <div
        className="flex flex-col items-start relative w-full gap-y-4 small:mx-0 focus:outline-none"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Product image gallery"
      >
        {/* Main Image - Reduced height */}
        <div className="relative w-full">
          <Container
            className="relative aspect-[4/3] small:aspect-[29/24] w-full overflow-hidden bg-ui-bg-subtle cursor-pointer"
            onClick={toggleFullscreen}
          >
            {/* Loading Placeholder */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-ui-bg-subtle">
                <div className="w-8 h-8 border-4 border-ui-border-base border-t-ui-fg-interactive rounded-full animate-spin"></div>
              </div>
            )}

            {images[currentImageIndex]?.url && (
              <Image
                src={images[currentImageIndex].url}
                priority={true}
                className={`absolute inset-0 rounded-rounded object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                alt={`Product image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 40vw, 800px"
                onLoad={handleImageLoad}
              />
            )}
          </Container>

          {/* Navigation Arrows (only if more than one image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
                aria-label="Previous image"
                tabIndex={0}
              >
                <ChevronLeft className="text-ui-fg-base" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
                aria-label="Next image"
                tabIndex={0}
              >
                <ChevronRight className="text-ui-fg-base" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails - Made more prominent */}
        {images.length > 1 && (
          <div className="relative w-full">
            <div className="flex gap-x-2 w-full overflow-x-auto py-2 no-scrollbar scrollbar-hide pb-4 relative">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative min-w-[90px] h-24 overflow-hidden rounded-md transition-all ${
                    currentImageIndex === index
                      ? "ring-2 ring-ui-fg-interactive opacity-100"
                      : "opacity-70 hover:opacity-100"
                  } focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive`}
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-current={currentImageIndex === index ? "true" : "false"}
                  tabIndex={0}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={`Product thumbnail ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="90px"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Visual indicator that there are more images */}
            {images.length > 3 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent w-10 h-24 pointer-events-none flex items-center justify-end">
                <div className="bg-ui-bg-base bg-opacity-80 rounded-full p-1 shadow-sm">
                  <ChevronRight className="text-ui-fg-base h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image counter indicator */}
        {images.length > 1 && (
          <div className="text-ui-fg-subtle text-xs mt-1">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={toggleFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen flex flex-col items-center justify-center p-4">
            {/* Close button - Updated with proper styling */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="absolute top-8 right-8 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-white z-10 flex items-center justify-center w-10 h-10"
              aria-label="Close fullscreen view"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>

            {/* Zoom controls */}
            <div className="absolute top-8 left-8 flex space-x-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-white flex items-center justify-center w-10 h-10"
                aria-label="Zoom out"
                tabIndex={0}
                disabled={scale <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-white flex items-center justify-center w-10 h-10"
                aria-label="Zoom in"
                tabIndex={0}
                disabled={scale >= 3}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            {/* Fullscreen image with zoom capability */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{ cursor: scale > 1 ? 'move' : 'auto' }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                </div>
              )}

              {images[currentImageIndex]?.url && (
                <div
                  className={`relative transition-transform duration-200 ease-out ${isDragging ? '' : 'transition-all'}`}
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    willChange: 'transform',
                    transformOrigin: 'center',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onDoubleClick={handleDoubleClick}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={images[currentImageIndex].url}
                    alt={`Product image ${currentImageIndex + 1}`}
                    className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    width={800}
                    height={800}
                    sizes="100vw"
                    style={{
                      maxHeight: 'calc(100vh - 100px)',
                      maxWidth: '100%',
                      height: 'auto',
                      pointerEvents: 'auto'
                    }}
                    onLoad={handleImageLoad}
                    draggable="false"
                  />
                </div>
              )}
            </div>

            {/* Fullscreen navigation - Fixed alignment */}
            {images.length > 1 && (
              <>
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-6 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="p-3 rounded-full shadow-md hover:bg-opacity-100 transition-all pointer-events-auto flex items-center justify-center w-12 h-12"
                    aria-label="Previous image"
                    tabIndex={0}
                  >
                    <ChevronLeft className="text-white h-8 w-8" />
                  </button>
                </div>

                <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-6 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="p-3 rounded-full shadow-md hover:bg-opacity-100 transition-all pointer-events-auto flex items-center justify-center w-12 h-12"
                    aria-label="Next image"
                    tabIndex={0}
                  >
                    <ChevronRight className="text-white h-8 w-8" />
                  </button>
                </div>
              </>
            )}

            {/* Instruction tip */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-opacity-70 text-xs">
              {scale > 1 ? "Drag to move • Double-click to reset" : "Double-click to zoom"}
            </div>

            {/* Fullscreen thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-x-2 absolute bottom-4 left-1/2 m-2 -translate-x-1/2 overflow-x-auto py-2 pb-4 max-w-full">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative min-w-[60px] h-16 overflow-hidden rounded-md transition-all ${
                      currentImageIndex === index
                        ? "ring-2 ring-white opacity-100"
                        : "opacity-70 hover:opacity-100"
                    } focus:outline-none focus:ring-2 focus:ring-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                      setScale(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                    aria-label={`View product image ${index + 1}`}
                    aria-current={currentImageIndex === index ? "true" : "false"}
                    tabIndex={0}
                  >
                    {image.url && (
                      <Image
                        src={image.url}
                        alt={`Product thumbnail ${index + 1}`}
                        className="object-cover"
                        fill
                        sizes="60px"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
