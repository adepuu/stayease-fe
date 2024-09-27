import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AvailablePropertyType } from "@/constants/Property";
import Image from "next/image";
import Link from "next/link";
import { useBookingValues } from "@/hooks/transactions/useBookingValues";

interface PropertyCardProps {
  property: AvailablePropertyType;
}

const PropertyListingCard: React.FC<PropertyCardProps> = (property) => {
  const {
    propertyId,
    imageUrl,
    propertyName,
    address,
    tenant,
    lowestAdjustedPrice,
  } = property.property;

  const { bookingValues } = useBookingValues();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Construct the URL with the date range
  const propertyUrl = `/properties/${propertyId}?${new URLSearchParams(
    Object.fromEntries(
      Object.entries(bookingValues).filter(
        ([key, value]) => value !== null && value !== undefined,
      ),
    ),
  ).toString()}`;

  return (
    <Link href={propertyUrl} passHref className="block h-full">
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={`${propertyName}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-blue-950 line-clamp-1">
                {propertyName}
              </h3>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                By: {tenant}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{address}</p>
          </div>
          <div className="mt-auto">
            <p className="text-lg font-bold text-blue-950">
              <span className="text-xs font-light text-gray-600 mr-0.5">
                Starts from{" "}
              </span>
              <span>{formatPrice(lowestAdjustedPrice)}</span>
              <span className="text-xs font-light"> / night</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyListingCard;
