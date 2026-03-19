import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

export function useFXData(selectedDate = null, horizon = 7) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const url = selectedDate
                ? `${API_BASE_URL}/dashboard?date=${selectedDate}&include_analysis=true&horizon=${horizon}`
                : `${API_BASE_URL}/dashboard?include_analysis=true&horizon=${horizon}`;

            const response = await axios.get(url, {
                params: selectedDate ? { date: selectedDate } : {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                setError(response.data.error);
                setData(null);
            } else {
                setData(response.data);
                setError(null);
            }
        } catch (err) {
            console.error("API Fetch Error:", err);
            setError("Failed to connect to FX Bridge. Ensure Python API is running.");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, horizon]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refresh: fetchData
    };
}
