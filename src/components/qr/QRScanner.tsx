import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { qrService } from '@/services/qrService';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
    onScanComplete: () => void;
}

export default function QRScanner({ onScanComplete }: QRScannerProps) {
    const qrRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        qrRef.current = new Html5Qrcode("reader");

        const onScanSuccess = async (decodedText: string) => {
            try {
                // Stop scanning
                if (qrRef.current) {
                    await qrRef.current.stop();
                }

                // Send the scanned data to the backend
                const result = await qrService.scanQRCode(decodedText);
                toast.success(result);
                onScanComplete();
            } catch (err) {
                toast.error("Erreur lors de la validation du QR code");
                console.error(err);
            }
        };

        const onScanFailure = (error: string) => {
            console.warn(`QR Code scan error: ${error}`);
        };

        // Start scanning
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                if (qrRef.current) {
                    qrRef.current.start(
                        { deviceId: devices[0].id },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 }
                        },
                        onScanSuccess,
                        onScanFailure
                    );
                }
            }
        }).catch(err => {
            console.error("Error getting cameras", err);
            toast.error("Erreur d'accès à la caméra");
        });

        // Cleanup
        return () => {
            if (qrRef.current) {
                qrRef.current.stop().catch(console.error);
            }
        };
    }, [onScanComplete]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div id="reader" className="w-full max-w-lg aspect-square"></div>
            <p className="text-gray-600">Scannez le QR code pour valider la course</p>
        </div>
    );
}
