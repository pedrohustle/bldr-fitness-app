import React, { useState, useContext } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { AuthContext } from '../../contexts/AuthContext';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { currentUser } = useContext(AuthContext); // pega o usuário logado

  const handleSubmit = async () => {
    if (!feedback.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        feedback,
        timestamp: new Date(),
        uid: currentUser.uid,
        email: currentUser.email || '',
      });
      setSent(true);
      setFeedback('');
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full text-black relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center border-[#d4af37] text-yellow-500">Envie seu Feedback</h2>

        {sent ? (
          <p className="text-green-600 text-center font-medium">Obrigado pelo seu feedback! ✅</p>
        ) : (
          <>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Escreva aqui suas sugestões, bugs ou elogios..."
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full transition"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
