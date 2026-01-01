import React, { useState, useEffect } from 'react';
import type { Attraction } from '../types';

interface Props {
    attraction: Attraction;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedAttraction: Attraction) => void;
}

const EditAttractionModal: React.FC<Props> = ({ attraction, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Attraction>(attraction);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setFormData(attraction);
        setError('');
    }, [attraction, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setError('景點名稱為必填欄位 (Name is required)');
            return;
        }

        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>編輯景點 (Edit Attraction)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">名稱 (Name) *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={error ? 'error-input' : ''}
                        />
                        {error && <span className="error-msg">{error}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="introduction">介紹 (Introduction)</label>
                        <textarea
                            id="introduction"
                            name="introduction"
                            value={formData.introduction}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">取消 (Cancel)</button>
                        <button type="submit" className="btn-save">儲存 (Save)</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAttractionModal;
