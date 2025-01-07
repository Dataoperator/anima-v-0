import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { openAIService } from '@/services/openai';

export const AITestPanel: React.FC = () => {
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testResult, setTestResult] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
    };

    const runTest = async () => {
        setTestStatus('testing');
        setTestResult('');
        setLogs([]);

        try {
            addLog('Initializing OpenAI API test...');

            // Test personality
            const testPersonality = {
                traits: [
                    ['curiosity', 0.8],
                    ['creativity', 0.7],
                    ['empathy', 0.9]
                ],
                emotional_state: {
                    current_emotion: 'calm',
                    intensity: 0.5,
                    duration: BigInt(0)
                }
            };

            addLog('Sending test request to OpenAI...');
            const response = await openAIService.generateResponse(
                "Hello, can you confirm you're working?",
                testPersonality
            );

            addLog('Received response from OpenAI');
            setTestResult(response);
            setTestStatus('success');
            addLog('Test completed successfully');

        } catch (error) {
            console.error('AI test failed:', error);
            setTestStatus('error');
            setTestResult(error instanceof Error ? error.message : 'Unknown error');
            addLog(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <Card className="bg-black border border-green-500">
            <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    {'>'} OPENAI STATUS
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <button
                        onClick={runTest}
                        disabled={testStatus === 'testing'}
                        className="w-full px-4 py-2 border border-green-500 hover:bg-green-500 
                                 hover:text-black transition-colors disabled:opacity-50 
                                 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {testStatus === 'testing' ? (
                            <>
                                <Activity className="w-4 h-4 animate-spin" />
                                TESTING CONNECTION...
                            </>
                        ) : (
                            <>
                                <Brain className="w-4 h-4" />
                                TEST AI CONNECTION
                            </>
                        )}
                    </button>

                    {/* Status Display */}
                    <AnimatePresence mode="wait">
                        {testStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <div className={`p-3 border ${
                                    testStatus === 'success' ? 'border-green-500/30 text-green-500' :
                                    testStatus === 'error' ? 'border-red-500/30 text-red-500' :
                                    'border-yellow-500/30 text-yellow-500'
                                } flex items-start gap-2`}>
                                    {testStatus === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                                    ) : testStatus === 'error' ? (
                                        <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
                                    ) : (
                                        <Activity className="w-5 h-5 mt-1 animate-spin flex-shrink-0" />
                                    )}
                                    <div>
                                        <div className="font-bold mb-1">
                                            {testStatus === 'success' ? 'AI Connection Successful' :
                                             testStatus === 'error' ? 'AI Connection Failed' :
                                             'Testing AI Connection'}
                                        </div>
                                        {testResult && <div className="text-sm">{testResult}</div>}
                                    </div>
                                </div>

                                {/* Logs Display */}
                                <div className="border border-green-500/30 p-2 max-h-40 overflow-y-auto font-mono text-xs">
                                    {logs.map((log, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-green-400/70"
                                        >
                                            {log}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
};
