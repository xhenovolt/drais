"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader, AlertCircle, Download, Printer, Plus } from "lucide-react";

export default function IDCardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fetch ID cards on mount
  useEffect(() => {
    fetchCards();
    fetchStudents();
  }, [page]);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      const response = await fetch(`/api/modules/students/id-cards?${params}`);
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch ID cards: ${response.statusText}`);
      }

      const data = await response.json();
      setCards(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch ID cards error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/modules/students/admissions?limit=100');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error('Fetch students error:', err);
    }
  };

  const handleGenerateCard = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch('/api/modules/students/id-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: parseInt(selectedStudent),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ID card');
      }

      setSuccess('ID card generated successfully!');
      setSelectedStudent('');
      
      // Refresh cards list
      setTimeout(() => {
        fetchCards();
      }, 1000);
    } catch (err) {
      setError(err.message);
      console.error('Generate card error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student ID Cards</h1>
          <p className="text-gray-600">Generate and manage student identification cards</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">{success}</AlertTitle>
          </Alert>
        )}

        {/* Generate Card Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New ID Card</CardTitle>
            <CardDescription>Create ID card for a student</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateCard} className="flex gap-4">
              <div className="flex-1">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger disabled={generating}>
                    <SelectValue placeholder="Select student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.first_name} {student.last_name} - {student.admission_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={generating || !selectedStudent}>
                {generating ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Card
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ID Cards List */}
        <Card>
          <CardHeader>
            <CardTitle>ID Cards</CardTitle>
            <CardDescription>Active student identification cards</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No ID cards generated yet. Create one above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card) => (
                    <div key={card.id} className="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                      {/* Card Visual */}
                      <div className="p-4 space-y-3">
                        <div className="bg-white rounded p-2 text-center">
                          {card.photo_url ? (
                            <img
                              src={card.photo_url}
                              alt={`${card.student_name}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400">No Photo</span>
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <p className="font-bold text-sm">{card.student_name}</p>
                          <p className="text-xs text-gray-600">ID: {card.card_number}</p>
                          <p className="text-xs text-gray-600">{card.admission_number}</p>
                          {card.class_name && (
                            <p className="text-xs text-gray-600">{card.class_name}</p>
                          )}
                        </div>
                        <div className="text-xs text-center text-gray-500 border-t pt-2">
                          <p>Issued: {formatDate(card.issue_date)}</p>
                          <p>Expires: {formatDate(card.expiry_date)}</p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="bg-blue-200 p-2 flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => window.print()}
                        >
                          <Printer className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            // Could implement download functionality
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
