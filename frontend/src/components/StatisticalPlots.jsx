import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import GlassCard from './GlassCard';

const PLOT_LABELS = {
    'adf_stationarity_summary.png': 'ADF Stationarity Test Summary',
    'returns_distribution.png': 'Currency Returns Distribution',
    'rolling_volatility.png': '30-Day Rolling Volatility',
    'correlation_heatmap.png': 'Currency Correlation Heatmap',
    'exchange_rate_trends.png': 'Exchange Rate Trends',
    'currency_trends.png': 'Currency Trends Analysis',
    'outlier_boxplot.png': 'Outlier Detection (Box Plot)',
    'usd_volatility.png': 'USD Volatility Profile',
    'usd_inr_30day_forecast.png': 'USD/INR 30-Day Forecast',
    'Baseline_7Day_USD_INR_Forecast_vs_Actual.png': 'Baseline 7-Day Forecast vs Actual'
};

const StatisticalPlots = () => {
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await axios.get('/api/plots');
                setPlots(response.data.plots || []);
            } catch (error) {
                console.error('Error fetching plots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlots();
    }, []);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setSelectedPlot(plots[index]);
    };

    const navigate = (direction) => {
        const newIndex = (currentIndex + direction + plots.length) % plots.length;
        setCurrentIndex(newIndex);
        setSelectedPlot(plots[newIndex]);
    };

    if (loading) {
        return (
            <GlassCard title="Statistical Analysis Plots">
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading plots...
                </div>
            </GlassCard>
        );
    }

    if (plots.length === 0) {
        return (
            <GlassCard title="Statistical Analysis Plots">
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Image size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No statistical plots available. Run the notebook analysis first.</p>
                </div>
            </GlassCard>
        );
    }

    return (
        <>
            <GlassCard title="Statistical Analysis Plots — Notebook Outputs">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    Generated from data science pipeline: stationarity tests, return distributions, volatility analysis, and forecasts.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem'
                }}>
                    {plots.map((filename, index) => (
                        <div
                            key={filename}
                            onClick={() => openLightbox(index)}
                            style={{
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <img
                                src={`/api/plots/${filename}`}
                                alt={PLOT_LABELS[filename] || filename}
                                style={{
                                    width: '100%',
                                    height: '180px',
                                    objectFit: 'cover',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}
                            />
                            <div style={{ padding: '0.7rem 0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart3 size={14} color="#2563EB" />
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#fff'
                                    }}>
                                        {PLOT_LABELS[filename] || filename.replace(/_/g, ' ').replace('.png', '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Lightbox Modal */}
            {selectedPlot && (
                <div
                    onClick={() => setSelectedPlot(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPlot(null); }}
                        style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'rgba(255,255,255,0.1)', border: 'none',
                            borderRadius: '50%', padding: '0.5rem', cursor: 'pointer',
                            color: '#fff', zIndex: 10
                        }}
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                        style={{
                            position: 'absolute', left: '1.5rem',
                            background: 'rgba(255,255,255,0.1)', border: 'none',
                            borderRadius: '50%', padding: '0.8rem', cursor: 'pointer',
                            color: '#fff'
                        }}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}>
                        <img
                            src={`/api/plots/${selectedPlot}`}
                            alt={PLOT_LABELS[selectedPlot] || selectedPlot}
                            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px' }}
                        />
                        <p style={{ color: '#fff', marginTop: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                            {PLOT_LABELS[selectedPlot] || selectedPlot.replace(/_/g, ' ').replace('.png', '')}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                            {currentIndex + 1} / {plots.length}
                        </p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(1); }}
                        style={{
                            position: 'absolute', right: '1.5rem',
                            background: 'rgba(255,255,255,0.1)', border: 'none',
                            borderRadius: '50%', padding: '0.8rem', cursor: 'pointer',
                            color: '#fff'
                        }}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            )}
        </>
    );
};

export default StatisticalPlots;
