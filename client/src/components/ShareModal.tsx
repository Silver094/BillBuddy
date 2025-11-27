import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.origin;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share BillBuddy">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-teal-600">
                        <Share2 size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Invite friends to BillBuddy</h3>
                    <p className="text-sm text-gray-500">
                        Share this link with your friends so they can join you on BillBuddy.
                    </p>
                </div>

                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 px-2"
                    />
                    <Button
                        size="sm"
                        variant={copied ? "primary" : "ghost"}
                        onClick={handleCopy}
                        className={copied
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }
                    >
                        {copied ? (
                            <>
                                <Check size={14} className="mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={14} className="mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
