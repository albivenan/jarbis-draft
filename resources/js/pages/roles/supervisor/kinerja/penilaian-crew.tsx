import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, User, TrendingUp, Award, Calendar } from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
  currentRating: number;
  totalTasks: number;
  completedTasks: number;
  efficiency: number;
  lastEvaluation: string;
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

export default function PenilaianCrew() {
  const [selectedCrew, setSelectedCrew] = useState<string>('');
  const [evaluationPeriod, setEvaluationPeriod] = useState('2024-01');
  const [generalNotes, setGeneralNotes] = useState('');

  const crewMembers: CrewMember[] = [
    {
      id: '1',
      name: 'Ahmad Yusuf',
      position: 'Senior Craftsman',
      avatar: '/avatars/ahmad.jpg',
      currentRating: 4.5,
      totalTasks: 25,
      completedTasks: 23,
      efficiency: 92,
      lastEvaluation: '2023-12-15'
    },
    {
      id: '2',
      name: 'Budi Santoso',
      position: 'Wood Specialist',
      avatar: '/avatars/budi.jpg',
      currentRating: 4.2,
      totalTasks: 20,
      completedTasks: 19,
      efficiency: 95,
      lastEvaluation: '2023-12-15'
    },
    {
      id: '3',
      name: 'Sari Dewi',
      position: 'Finishing Expert',
      avatar: '/avatars/sari.jpg',
      currentRating: 4.7,
      totalTasks: 18,
      completedTasks: 18,
      efficiency: 100,
      lastEvaluation: '2023-12-15'
    },
    {
      id: '4',
      name: 'Eko Prasetyo',
      position: 'Junior Craftsman',
      avatar: '/avatars/eko.jpg',
      currentRating: 3.8,
      totalTasks: 15,
      completedTasks: 13,
      efficiency: 87,
      lastEvaluation: '2023-12-15'
    }
  ];

  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria[]>([
    {
      id: '1',
      name: 'Kualitas Pekerjaan',
      weight: 30,
      score: 0,
      maxScore: 5
    },
    {
      id: '2',
      name: 'Ketepatan Waktu',
      weight: 25,
      score: 0,
      maxScore: 5
    },
    {
      id: '3',
      name: 'Keahlian Teknis',
      weight: 20,
      score: 0,
      maxScore: 5
    },
    {
      id: '4',
      name: 'Kerjasama Tim',
      weight: 15,
      score: 0,
      maxScore: 5
    },
    {
      id: '5',
      name: 'Inisiatif & Kreativitas',
      weight: 10,
      score: 0,
      maxScore: 5
    }
  ]);

  const updateCriteriaScore = (id: string, score: number) => {
    setEvaluationCriteria(prev => prev.map(criteria => 
      criteria.id === id ? { ...criteria, score } : criteria
    ));
  };

  const calculateTotalScore = () => {
    return evaluationCriteria.reduce((total, criteria) => {
      return total + (criteria.score * criteria.weight / 100);
    }, 0);
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 4.5) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 4.0) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 3.5) return { level: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const selectedCrewData = crewMembers.find(crew => crew.id === selectedCrew);

  const handleSubmitEvaluation = () => {
    if (!selectedCrew) {
      alert('Pilih crew member terlebih dahulu');
      return;
    }
    
    const totalScore = calculateTotalScore();
    console.log('Submitting evaluation:', {
      crewId: selectedCrew,
      period: evaluationPeriod,
      criteria: evaluationCriteria,
      totalScore,
      notes: generalNotes
    });
    
    alert('Penilaian berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Penilaian Kinerja Crew</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <input
            type="month"
            value={evaluationPeriod}
            onChange={(e) => setEvaluationPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Crew Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Crew Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {crewMembers.map((crew) => (
              <div
                key={crew.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCrew === crew.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCrew(crew.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{crew.name}</h3>
                    <p className="text-sm text-gray-600">{crew.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{crew.currentRating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {crew.completedTasks}/{crew.totalTasks} tugas
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{crew.efficiency}%</div>
                    <div className="text-xs text-gray-500">Efisiensi</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCrewData && (
        <>
          {/* Crew Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview Kinerja - {selectedCrewData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCrewData.currentRating}</div>
                  <div className="text-sm text-gray-600">Rating Saat Ini</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedCrewData.completedTasks}</div>
                  <div className="text-sm text-gray-600">Tugas Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedCrewData.efficiency}%</div>
                  <div className="text-sm text-gray-600">Efisiensi</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{selectedCrewData.lastEvaluation}</div>
                  <div className="text-sm text-gray-600">Evaluasi Terakhir</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Kriteria Penilaian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {evaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-medium">{criteria.name}</h4>
                        <p className="text-sm text-gray-600">Bobot: {criteria.weight}%</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Skor: {criteria.score}/{criteria.maxScore}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateCriteriaScore(criteria.id, star)}
                          className={`p-1 ${
                            star <= criteria.score 
                              ? 'text-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {criteria.score === 1 ? 'Sangat Kurang' :
                         criteria.score === 2 ? 'Kurang' :
                         criteria.score === 3 ? 'Cukup' :
                         criteria.score === 4 ? 'Baik' :
                         criteria.score === 5 ? 'Sangat Baik' : 'Belum dinilai'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Skor Keseluruhan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">
                  {calculateTotalScore().toFixed(1)}
                </div>
                <Badge className={getPerformanceLevel(calculateTotalScore()).color}>
                  {getPerformanceLevel(calculateTotalScore()).level}
                </Badge>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(calculateTotalScore() / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Catatan & Rekomendasi</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Masukkan catatan, feedback, atau rekomendasi untuk pengembangan crew..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button onClick={handleSubmitEvaluation} size="lg">
              <Award className="h-4 w-4 mr-2" />
              Simpan Penilaian
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
