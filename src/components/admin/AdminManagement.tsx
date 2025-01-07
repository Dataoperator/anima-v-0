import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/contexts/auth-context';
import { ShieldAlert, Trash2, UserPlus, AlertTriangle } from 'lucide-react';

interface AdminListItem {
    principal: string;
    addedAt?: number;
}

export const AdminManagement: React.FC = () => {
    const [newAdminId, setNewAdminId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [admins, setAdmins] = useState<AdminListItem[]>([]);
    const [isConfirmingRemoval, setIsConfirmingRemoval] = useState<string | null>(null);
    const { actor, identity } = useAuth();
    const [currentUserPrincipal, setCurrentUserPrincipal] = useState<string>('');

    useEffect(() => {
        if (identity) {
            setCurrentUserPrincipal(identity.getPrincipal().toString());
        }
    }, [identity]);

    useEffect(() => {
        fetchAdmins();
    }, [actor]);

    const fetchAdmins = async () => {
        try {
            // This would need to be implemented in the backend
            const result = await actor?.list_admins();
            if ('Ok' in result) {
                setAdmins(result.Ok.map(principal => ({
                    principal: principal.toString(),
                    addedAt: Date.now() // In real implementation, this would come from backend
                })));
            }
        } catch (err) {
            console.error('Failed to fetch admins:', err);
        }
    };

    const validatePrincipal = (id: string): boolean => {
        try {
            Principal.fromText(id);
            // Additional validation rules
            if (id.length < 10) return false; // Minimum length check
            if (!/^[a-z0-9-]+$/.test(id)) return false; // Character validation
            if (admins.some(admin => admin.principal === id)) return false; // Duplicate check
            return true;
        } catch {
            return false;
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validatePrincipal(newAdminId)) {
            setError('Invalid or duplicate Principal ID');
            return;
        }

        try {
            const result = await actor?.add_admin(Principal.fromText(newAdminId));
            if ('Ok' in result) {
                setSuccess('Admin added successfully');
                setNewAdminId('');
                fetchAdmins(); // Refresh list
            } else if ('Err' in result) {
                setError(result.Err);
            }
        } catch (err) {
            setError('Failed to add admin');
            console.error('Add admin error:', err);
        }
    };

    const handleRemoveAdmin = async (principalId: string) => {
        if (principalId === currentUserPrincipal) {
            setError("You can't remove yourself as admin");
            return;
        }

        try {
            const result = await actor?.remove_admin(Principal.fromText(principalId));
            if ('Ok' in result) {
                setSuccess('Admin removed successfully');
                fetchAdmins(); // Refresh list
            } else if ('Err' in result) {
                setError(result.Err);
            }
        } catch (err) {
            setError('Failed to remove admin');
            console.error('Remove admin error:', err);
        } finally {
            setIsConfirmingRemoval(null);
        }
    };

    const formatPrincipalId = (id: string): string => {
        return `${id.slice(0, 5)}...${id.slice(-5)}`;
    };

    return (
        <Card className="bg-black border border-green-500">
            <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2" />
                    {'>'} ADMIN MANAGEMENT
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Add Admin Form */}
                <form onSubmit={handleAddAdmin} className="space-y-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={newAdminId}
                            onChange={(e) => {
                                setNewAdminId(e.target.value);
                                setError(null);
                                setSuccess(null);
                            }}
                            placeholder="Principal ID"
                            className="w-full bg-black border border-green-500/30 px-4 py-2 text-green-500 
                                     placeholder-green-500/30 focus:border-green-500 focus:outline-none
                                     transition-colors pr-10"
                        />
                        <UserPlus className="absolute right-3 top-2.5 h-5 w-5 text-green-500/50" />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm border border-red-500/30 p-2 flex items-center"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {'>'} ERROR: {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-green-500 text-sm border border-green-500/30 p-2"
                            >
                                {'>'} {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 border border-green-500 hover:bg-green-500 
                                 hover:text-black transition-colors flex items-center justify-center"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        ADD ADMIN
                    </button>
                </form>

                {/* Admin List */}
                <div className="space-y-2">
                    <h3 className="text-green-400 text-sm mb-3">{'>'} CURRENT ADMINS</h3>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {admins.map((admin) => (
                                <motion.div
                                    key={admin.principal}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-2 border border-green-500/30 
                                             hover:border-green-500 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <ShieldAlert className="w-4 h-4 mr-2 text-green-500/50" />
                                        <span className="font-mono">
                                            {formatPrincipalId(admin.principal)}
                                            {admin.principal === currentUserPrincipal && (
                                                <span className="text-green-500/50 ml-2">(you)</span>
                                            )}
                                        </span>
                                    </div>
                                    {isConfirmingRemoval === admin.principal ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRemoveAdmin(admin.principal)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setIsConfirmingRemoval(null)}
                                                className="text-green-500 hover:text-green-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        admin.principal !== currentUserPrincipal && (
                                            <button
                                                onClick={() => setIsConfirmingRemoval(admin.principal)}
                                                className="text-green-500/50 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
