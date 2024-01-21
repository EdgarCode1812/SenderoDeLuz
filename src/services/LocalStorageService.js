export class LocalStorageService {

    static isTokenExpired() {
        const token = this.getToken();
        if (!token) {
            // No hay token, por lo que consideramos que está caducado
            return true;
        }

        // Decodificar el token para acceder a la marca de tiempo de expiración
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenPayload.exp * 1000; // Convertir a milisegundos

        // Comparar la marca de tiempo de expiración con la hora actual
        const currentTime = Date.now();
        return currentTime > expirationTime;
    }


    static signOut() {
        localStorage.removeItem('TOKEN_KEY');
        localStorage.removeItem('ROLE_KEY');
        localStorage.removeItem('EMAIL_KEY');
        localStorage.removeItem('ID_KEY');
    }

    // Guardamos el token en la Local Store
    static saveTokens(accessToken, role, email, id) {
        localStorage.setItem('TOKEN_KEY', accessToken);
        localStorage.setItem('ROLE_KEY', role);
        localStorage.setItem('EMAIL_KEY', email);
        localStorage.setItem('ID_KEY', id);

    }
    // Obtenemos el token
    static getToken() {
        return localStorage.getItem('TOKEN_KEY');
    }

    // Obtenemos el role
    static getRole() {
        return localStorage.getItem('ROLE_KEY');
    }

    // Obtenemos el role
    static getEmail() {
        return localStorage.getItem('EMAIL_KEY');
    }

    // Obtenemos el id
    static getId() {
        return localStorage.getItem('ID_KEY');
    }

}

