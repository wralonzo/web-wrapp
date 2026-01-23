import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IpService {
    /**
     * Obtiene la dirección IP local del cliente utilizando la API de WebRTC.
     * Nota: Dependiendo del navegador y la configuración, esto puede fallar o devolver una dirección mDNS (.local).
     */
    async getLocalIp(): Promise<string> {
        return new Promise((resolve) => {
            const pc = new RTCPeerConnection({
                iceServers: [],
            });

            pc.createDataChannel('');

            pc.createOffer()
                .then((offer) => pc.setLocalDescription(offer))
                .catch(() => resolve('unknown'));

            pc.onicecandidate = (event) => {
                if (!event || !event.candidate) {
                    return;
                }

                const candidate = event.candidate.candidate;
                // Regex para buscar IPv4 o IPv6 en el string del candidato ICE
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const match = ipRegex.exec(candidate);

                if (match) {
                    const ip = match[1];
                    // Evitamos IPs de loopback
                    if (ip !== '127.0.0.1' && ip !== '0.0.0.0') {
                        resolve(ip);
                        pc.onicecandidate = null;
                        pc.close();
                    }
                }
            };

            // Si después de 1.5 segundos no hemos obtenido nada, resolvemos con 'unknown'
            setTimeout(() => {
                pc.close();
                resolve('unknown');
            }, 1500);
        });
    }
}
