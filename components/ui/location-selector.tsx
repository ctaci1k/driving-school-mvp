// components/ui/location-selector.tsx
"use client"

import * as React from "react"
import { MapPin, Building2, Navigation, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Location {
  id: string
  name: string
  code: string
  address: string
  city: string
  postalCode: string
  phone?: string
  isPrimary?: boolean
  isActive?: boolean
  latitude?: number
  longitude?: number
  maxInstructors?: number
  maxVehicles?: number
}

interface LocationSelectorProps {
  locations?: Location[]
  value?: string
  onChange?: (value: string) => void
  variant?: "select" | "cards" | "radio"
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function LocationSelector({
  locations = [],
  value,
  onChange,
  variant = "select",
  className,
  placeholder = "Select location",
  disabled = false
}: LocationSelectorProps) {
  
  if (variant === "select") {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn("w-full", className)}>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>{location.name}</span>
                  <span className="text-gray-500">• {location.city}</span>
                </div>
                {location.isPrimary && (
                  <Badge variant="default" className="ml-2 text-xs">Primary</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {locations.map((location) => (
          <Card 
            key={location.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              value === location.id && "ring-2 ring-blue-500"
            )}
            onClick={() => !disabled && onChange?.(location.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                {location.isPrimary && (
                  <Badge variant="default" className="text-xs">Primary</Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{location.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{location.address}</p>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 className="h-3 w-3" />
                  <span>{location.city}, {location.postalCode}</span>
                </div>
                {location.phone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>{location.phone}</span>
                  </div>
                )}
                {location.latitude && location.longitude && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Navigation className="h-3 w-3" />
                    <span>GPS Available</span>
                  </div>
                )}
              </div>

              {location.maxInstructors && location.maxVehicles && (
                <div className="flex gap-3 mt-3 pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    {location.maxInstructors} instructors
                  </span>
                  <span className="text-xs text-gray-500">
                    {location.maxVehicles} vehicles
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Radio variant
  return (
    <RadioGroup value={value} onValueChange={onChange} disabled={disabled} className={className}>
      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.id} className="relative">
            <RadioGroupItem
              value={location.id}
              id={location.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={location.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                "hover:bg-gray-50",
                "peer-checked:border-blue-600 peer-checked:bg-blue-50"
              )}
            >
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{location.name}</span>
                  {location.isPrimary && (
                    <Badge variant="default" className="text-xs">Primary</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{location.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {location.city}, {location.postalCode}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}