import React, { useState } from 'react';
import axios from 'axios';
import {
    Calculator, ArrowRight, TrendingUp, TrendingDown, AlertCircle,
    CheckCircle, ArrowDownLeft, ArrowUpRight, Monitor, Shield,
    Target, Zap, AlertTriangle
} from 'lucide-react';
import GlassCard from './GlassCard';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ExposureCalculator = ({ horizon = 7 }) => {
    const [formData, setFormData] = useState({
        amount: 100000,
        currency: 'USD',
        type: 'Importer',
        targetMargin: 5.0
    });
    const [result, setResult] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCalculate = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const payload = { ...formData, horizon };
            // Standard exposure calculation
            const response = await axios.post('http://localhost:5000/api/calculate-exposure', payload);
            if (response.data.error) throw new Error(response.data.error);
            setResult(response.data);

            // Prescriptive recommendation (parallel call)
            const recResponse = await axios.post('http://localhost:5000/api/business-recommendation', payload);
            if (recResponse.data.error) throw new Error(recResponse.data.error);
            setRecommendation(recResponse.data);
        } catch (error) {
            console.error("Calculation Error", error);
            setApiError(error.response?.data?.error || error.message || "Failed to run simulation.");
        } finally {
            setLoading(false);
        }
    };

    // Scenario chart
    const chartData = (result && result.scenarios) ? {
        labels: result.scenarios.map(s => s.scenario),
        datasets: [
            {
                label: 'Financial Impact (Gain/Loss)',
                data: result.scenarios.map(s => s.gain_loss),
                backgroundColor: result.scenarios.map(s => s.gain_loss >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                borderColor: result.scenarios.map(s => s.gain_loss >= 0 ? '#10B981' : '#EF4444'),
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
            x: { grid: { display: false }, ticks: { color: '#bbb' } }
        }
    };

    // Business type icons
    const typeIcons = {
        'Importer': <ArrowDownLeft size={16} />,
        'Exporter': <ArrowUpRight size={16} />,
        'IT Services': <Monitor size={16} />
    };

    // Shared Styles
    const s = {
        container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
        label: { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '8px', fontWeight: 600 },
        inputGroup: { marginBottom: '20px' },
        input: {
            width: '100%', appearance: 'none', background: '#0a0a0a', border: '1px solid #333',
            borderRadius: '12px', padding: '14px 16px', color: '#fff', outline: 'none', fontSize: '1rem',
            fontFamily: 'monospace', transition: 'all 0.2s'
        },
        buttonContainer: { display: 'flex', gap: '8px', background: '#0a0a0a', padding: '6px', borderRadius: '14px', border: '1px solid #222' },
        typeButton: (isActive) => ({
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px 10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.3s', border: isActive ? '1px solid #3b82f6' : '1px solid transparent',
            background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
            color: isActive ? '#fff' : '#666',
            boxShadow: isActive ? '0 0 20px rgba(37, 99, 235, 0.2)' : 'none'
        }),
        actionButton: {
            width: '100%', padding: '16px', background: '#fff', color: '#000', border: 'none',
            borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'transform 0.1s, opacity 0.2s', marginTop: '10px'
        },
        card: { background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '24px' },
        tableCell: { padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#ccc' },
        tableHeader: { padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', textAlign: 'left' }
    };

    return (
        <div style={s.container}>
            {/* Left Panel: Inputs */}
            <div>
                <GlassCard title="Business Parameters">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <div style={s.inputGroup}>
                            <label style={s.label}>Business Model</label>
                            <div style={s.buttonContainer}>
                                {['Importer', 'Exporter', 'IT Services'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFormData({ ...formData, type: role })}
                                        style={s.typeButton(formData.type === role)}
                                    >
                                        {typeIcons[role]}
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}>Target Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                style={s.input}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                            </select>
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}>Transaction Volume ({formData.currency})</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '14px', color: '#666' }}>
                                    {formData.currency === 'GBP' ? '£' : formData.currency === 'EUR' ? '€' : formData.currency === 'JPY' ? '¥' : '$'}
                                </span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    style={{ ...s.input, paddingLeft: '32px' }}
                                />
                            </div>
                        </div>

                        <div style={s.inputGroup}>
                            <label style={s.label}>Target Profit Margin (%)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '14px', color: '#666' }}>%</span>
                                <input
                                    type="number"
                                    name="targetMargin"
                                    step="0.1"
                                    value={formData.targetMargin}
                                    onChange={handleChange}
                                    style={{ ...s.input, paddingLeft: '32px' }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            disabled={loading}
                            style={{ ...s.actionButton, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? <div className="animate-spin"><AlertCircle size={20} /></div> : <Calculator size={20} />}
                            {loading ? 'Simulating Market Impact...' : 'Run Neural Simulation'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                        {apiError && (
                            <div style={{ marginTop: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#EF4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} />
                                {apiError}
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Right Panel: Results & Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {!result && !recommendation && (
                    <div style={{ ...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', opacity: 0.6 }}>
                        <Calculator size={48} color="#333" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Ready to Calculate</h3>
                        <p style={{ color: '#888', textAlign: 'center', maxWidth: '300px', margin: '8px 0' }}>
                            Enter your transaction details on the left to simulate real-time market scenarios and exposure risk.
                        </p>
                    </div>
                )}

                {/* Prescriptive Recommendation Panel */}
                {recommendation && (
                    <GlassCard title="Prescriptive Strategy">
                        {/* Break Event metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Break-Even Rate (INR)</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                                    ₹{recommendation?.break_even_rate ? recommendation.break_even_rate.toFixed(2) : '0.00'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: recommendation?.break_even_risk === 'SAFE' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                    {recommendation?.break_even_risk === 'SAFE' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                    Margin Status: {recommendation?.break_even_risk || 'N/A'}
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Profit at Risk</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#F59E0B', fontFamily: 'monospace' }}>
                                    ₹{recommendation?.profit_at_risk?.profit_at_risk_inr ? recommendation.profit_at_risk.profit_at_risk_inr.toLocaleString() : '0'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '8px' }}>Based on {horizon}D Forecast</div>
                            </div>
                        </div>

                        {/* Action Box */}
                        <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '12px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <Shield color="#2563EB" size={24} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Recommended Action</h3>
                            </div>
                            <div style={{ fontSize: '1.1rem', color: '#eee', lineHeight: '1.6', marginBottom: '16px' }}>
                                {recommendation?.recommendation?.action || 'No action recommended.'}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Hedge Ratio</div>
                                    <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>{recommendation?.recommendation?.hedge_percentage ? recommendation.recommendation.hedge_percentage + '%' : '0%'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Urgency</div>
                                    <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>{recommendation?.recommendation?.urgency || 'NONE'}</div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                )}

                {/* Scenario Sensitivity Matrix */}
                {recommendation && recommendation.sensitivity_matrix && (
                    <GlassCard title="Margin Sensitivity Matrix">
                        <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={s.tableHeader}>Rate (INR)</th>
                                        <th style={s.tableHeader}>Scenario</th>
                                        <th style={s.tableHeader}>Impact (INR)</th>
                                        <th style={s.tableHeader}>Margin Effect</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recommendation?.sensitivity_matrix || []).map((row, idx) => {
                                        const isPositive = row.gain_loss_inr >= 0;
                                        return (
                                            <tr key={idx}>
                                                <td style={{ ...s.tableCell, fontFamily: 'monospace' }}>{row.new_rate?.toFixed(4) || '0.000'}</td>
                                                <td style={s.tableCell}>{row.scenario}</td>
                                                <td style={{ ...s.tableCell, color: isPositive ? '#10B981' : '#EF4444', fontFamily: 'monospace' }}>
                                                    {isPositive ? '+' : ''}₹{row.gain_loss_inr?.toLocaleString() || '0'}
                                                </td>
                                                <td style={{ ...s.tableCell, color: isPositive ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                                                    {isPositive ? '+' : ''}{row.margin_pct}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                )}

                {/* Legacy Chart (Optional overlay view) */}
                {result && (
                    <GlassCard title="Visual Market Impact">
                        <div style={{ height: '300px', width: '100%' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
};

export default ExposureCalculator;
