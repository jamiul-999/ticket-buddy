import React from 'react';
import { QueryResponse, RouteResult } from '../../services/types/query';
import { Card } from '../common/Card';
import { MapPin, Phone, Mail, Globe, Bus, DollarSign } from 'lucide-react';

interface QueryResultProps {
  result: QueryResponse;
  onBook?: (result: RouteResult, from: string, to: string) => void;
}

export const QueryResult: React.FC<QueryResultProps> = ({ result, onBook }) => {
  const renderRouteResults = () => {
    if (!result.results || result.results.length === 0) return null;

    return (
      <div className="grid gap-4 mt-4">
        {result.results.map((route, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bus className="text-primary" size={24} />
                  <h3 className="text-lg font-bold">{route.provider}</h3>
                </div>
                <div className="text-gray-600 space-y-1">
                  {result.from && result.to && (
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {result.from} → {result.to}
                    </p>
                  )}
                  <p>Dropping Point: {route.dropping_point}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <DollarSign size={20} />
                  {route.price}
                </div>
                {onBook && result.from && result.to && (
                  <button
                    onClick={() => onBook(route, result.from!, result.to!)}
                    className="mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

   const renderContactInfo = () => {
    if (!result.contact_info) return null;

    const { phone, email, address, website } = result.contact_info;

    return (
      <Card className="mt-4">
        <h3 className="text-lg font-bold mb-4">{result.contact_info.provider}</h3>
        <div className="space-y-3">
          {phone && (
            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{phone}</p>
              </div>
            </div>
          )}
          {email && (
            <div className="flex items-start gap-3">
              <Mail className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{address}</p>
              </div>
            </div>
          )}
          {website && (
            <div className="flex items-start gap-3">
              <Globe className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {website}
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{result.answer}</p>
        </div>
      </Card>

      {renderRouteResults()}
      {renderContactInfo()}
    </div>
  );
};
