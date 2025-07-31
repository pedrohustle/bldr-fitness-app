import { useState, useRef, useEffect } from 'react';
import { Camera, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const TapeMeasureIconAlt = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="32" cy="32" r="28" />
    <path d="M32 4v24" />
    <path d="M20 20h8" />
    <path d="M36 20h8" />
    <path d="M16 32h32" />
    <path d="M32 36v20" />
    <path d="M24 44h16" />
  </svg>
);

const Progress = () => {
  const [personalRecords, setPersonalRecords] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    exercise: '',
    weight: '',
    unit: 'kg',
    date: ''
  });

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthsShort[new Date().getMonth()]);
  const [inputWeight, setInputWeight] = useState('');

  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    part: '',
    current: '',
    previous: '',
    unit: 'cm'
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const insertWeightHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const initialWeightHistory = monthsShort.map(m => ({ month: m, weight: null }));
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || !userDoc.data().weightHistory) {
          await setDoc(userRef, { weightHistory: initialWeightHistory }, { merge: true });
        }
      } catch (error) {
        console.error('Erro ao inserir weightHistory:', error);
      }
    };

    insertWeightHistory();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPersonalRecords(data.personalRecords || []);
          setWeightData(data.weightHistory || monthsShort.map(m => ({ month: m, weight: null })));
          setMeasurements(data.measurements || []);
          setProgressPhotos(data.progressPhotos || []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchUserData();
    });

    return () => unsubscribe();
  }, []);

  // Modal Peso
  const openWeightModal = () => {
    setSelectedMonth(monthsShort[new Date().getMonth()]);
    setInputWeight('');
    setShowWeightModal(true);
  };
  const closeWeightModal = () => setShowWeightModal(false);

  const handleSaveWeight = async () => {
    if (!inputWeight || isNaN(Number(inputWeight)) || Number(inputWeight) <= 0) {
      alert('Digite um peso válido.');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }
    const updatedWeightData = weightData.map(item =>
      item.month === selectedMonth ? { ...item, weight: Number(inputWeight) } : item
    );
    setWeightData(updatedWeightData);
    setShowWeightModal(false);

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { weightHistory: updatedWeightData }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar peso:', error);
      alert('Erro ao salvar peso. Tente novamente.');
    }
  };

  // Modal Medidas Corporais
  const openMeasurementsModal = () => {
    setNewMeasurement({ part: '', current: '', previous: '', unit: 'cm' });
    setShowMeasurementsModal(true);
  };
  const closeMeasurementsModal = () => setShowMeasurementsModal(false);

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveMeasurement = async () => {
    if (!newMeasurement.part.trim() || !newMeasurement.current) {
      alert('Preencha o nome da parte do corpo e o valor atual.');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }
    const updatedMeasurements = [...measurements, {
      part: newMeasurement.part.trim(),
      current: Number(newMeasurement.current),
      previous: newMeasurement.previous ? Number(newMeasurement.previous) : 0,
      unit: newMeasurement.unit || 'cm'
    }];
    setMeasurements(updatedMeasurements);
    setShowMeasurementsModal(false);

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { measurements: updatedMeasurements }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar medidas:', error);
      alert('Erro ao salvar medidas. Tente novamente.');
    }
  };

  const getDifference = (current, previous) => {
    const diff = current - previous;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      isNegative: diff < 0
    };
  };

  // Upload foto para Storage + salvar URL no Firestore
  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado");
        return;
      }

      try {
        const fileRef = storageRef(storage, `users/${user.uid}/progress/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        let currentPhotos = [];
        if (userDoc.exists()) {
          currentPhotos = userDoc.data().progressPhotos || [];
        }

        const updatedPhotos = [...currentPhotos, downloadURL];
        await updateDoc(userRef, {
          progressPhotos: updatedPhotos,
        });

        setProgressPhotos(updatedPhotos);

        alert("Foto adicionada com sucesso!");
        e.target.value = ""; // limpa input
      } catch (error) {
        console.error("Erro ao enviar foto:", error);
        alert("Erro ao enviar foto. Tente novamente.");
      }
    }
  };

  // Modal Records
  const openRecordModal = () => {
    setNewRecord({
      exercise: '',
      weight: '',
      unit: 'kg',
      date: ''
    });
    setShowRecordModal(true);
  };
  const closeRecordModal = () => setShowRecordModal(false);

  const handleRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveRecord = async () => {
    if (!newRecord.exercise.trim() || !newRecord.weight || !newRecord.date) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    // Atualiza estado local
    const updatedRecords = [...personalRecords, newRecord];
    setPersonalRecords(updatedRecords);
    setShowRecordModal(false);

    // Salva no Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { personalRecords: updatedRecords }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar record pessoal:', error);
      alert('Erro ao salvar record pessoal. Tente novamente.');
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="bg-black text-yellow-400 p-6 rounded-b-3xl text-center">
        <h1 className="text-2xl font-montserrat">Progresso</h1>
        <p className="text-gray-300">Acompanhe sua evolução</p>
      </div>

      {/* Galeria de Fotos */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="font-montserrat text-lg flex items-center gap-2">
            <Camera size={20} className="text-primary" />
            Galeria de Progresso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            {progressPhotos.length === 0 ? (
              <>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Camera size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-montserrat">Antes</p>
                  </div>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Camera size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-montserrat">Atual</p>
                  </div>
                </div>
              </>
            ) : (
              progressPhotos.map((url, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Foto de progresso ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleAddPhotoClick} variant='primary'>
            <Camera className="mr-2" size={18} />
            Adicionar Foto
          </Button>
        </CardContent>
      </Card>

      {/* Gráfico de Peso */}
      <Card className="card-glass">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="font-montserrat text-lg flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Evolução do Peso
          </CardTitle>
          <Button size="sm" variant="primary" onClick={openWeightModal}>
            + Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData.length
                ? weightData
                : monthsShort.map(m => ({ month: m, weight: null }))
              }>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#333333',
                    border: '1px solid #4B5563',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                  isAnimationActive={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-montserrat-bold text-primary">
              {weightData.findLast(d => d.weight !== null)?.weight ?? '0'} kg
            </p>
            <p className="text-sm text-muted-foreground font-montserrat">Peso atual</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal para adicionar peso */}
      {showWeightModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeWeightModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 font-montserrat text-center">
              Adicionar / Atualizar Peso
            </h2>
            <div className="space-y-4">
              <label className="block font-montserrat mb-1">Mês</label>
              <select
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {monthsShort.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <label className="block font-montserrat mb-1">Peso (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                value={inputWeight}
                onChange={e => setInputWeight(e.target.value)}
                placeholder="Digite o peso"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeWeightModal}>Cancelar</Button>
              <Button onClick={handleSaveWeight}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Medidas Corporais */}
      <Card className="card-glass">
        <CardHeader className="flex justify-between items-center">
          <TapeMeasureIconAlt className="w-5 h-5 text-black" />
          <CardTitle className="font-montserrat text-lg">Medidas Corporais</CardTitle>
          <Button size="sm" variant="primary" onClick={openMeasurementsModal}>
            + Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {measurements.length > 0 ? measurements.map((measurement, index) => {
              const diff = getDifference(measurement.current, measurement.previous);
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-montserrat text-foreground">{measurement.part}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-montserrat-bold text-lg">
                      {measurement.current}{measurement.unit}
                    </span>
                    {diff.value > 0 && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          diff.isPositive ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
                        }`}
                      >
                        {diff.isPositive ? '+' : '-'}{diff.value}{measurement.unit}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            }) : (
              <p className="text-muted-foreground font-montserrat">Sem medidas registradas.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Medidas Corporais */}
      {showMeasurementsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeMeasurementsModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 font-montserrat text-center">
              Adicionar Medida Corporal
            </h2>
            <div className="space-y-4">
              <label className="block font-montserrat mb-1">Parte do Corpo</label>
              <input
                type="text"
                name="part"
                value={newMeasurement.part}
                onChange={handleMeasurementChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                placeholder="Ex: Braço, Cintura"
              />
              <label className="block font-montserrat mb-1">Valor Atual ({newMeasurement.unit})</label>
              <input
                type="number"
                name="current"
                min="0"
                step="0.1"
                value={newMeasurement.current}
                onChange={handleMeasurementChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
              />
              <label className="block font-montserrat mb-1">Valor Anterior ({newMeasurement.unit})</label>
              <input
                type="number"
                name="previous"
                min="0"
                step="0.1"
                value={newMeasurement.previous}
                onChange={handleMeasurementChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                placeholder="Opcional"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeMeasurementsModal}>Cancelar</Button>
              <Button onClick={handleSaveMeasurement}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Records Pessoais */}
      <Card className="card-glass">
        <CardHeader className="flex justify-between items-center">
          <Award size={20} className="text-primary" />
          <CardTitle className="font-montserrat text-lg">Records Pessoais</CardTitle>
          <Button size="sm" variant="primary" onClick={openRecordModal}>
            + Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          {personalRecords.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {personalRecords.map((record, index) => (
                <li key={index} className="flex justify-between items-center border-b border-muted pb-1">
                  <span className="font-montserrat">{record.exercise}</span>
                  <span className="font-montserrat-bold">
                    {record.weight} {record.unit}
                  </span>
                  <span className="text-xs text-muted-foreground font-montserrat">
                    {new Date(record.date).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground font-montserrat">Nenhum record registrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Modal Records */}
      {showRecordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeRecordModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 font-montserrat text-center">
              Adicionar Record Pessoal
            </h2>
            <div className="space-y-4">
              <label className="block font-montserrat mb-1">Exercício</label>
              <input
                type="text"
                name="exercise"
                value={newRecord.exercise}
                onChange={handleRecordChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                placeholder="Nome do exercício"
              />
              <label className="block font-montserrat mb-1">Peso</label>
              <input
                type="number"
                name="weight"
                min="0"
                step="0.1"
                value={newRecord.weight}
                onChange={handleRecordChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
                placeholder="Peso levantado"
              />
              <label className="block font-montserrat mb-1">Unidade</label>
              <select
                name="unit"
                value={newRecord.unit}
                onChange={handleRecordChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
              <label className="block font-montserrat mb-1">Data</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleRecordChange}
                className="w-full px-3 py-2 border rounded-md font-montserrat"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeRecordModal}>Cancelar</Button>
              <Button onClick={handleSaveRecord}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
