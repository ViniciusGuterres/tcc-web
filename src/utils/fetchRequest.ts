import Cookies from "js-cookie";

type MethodsAllowed = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

interface Options {
    method: MethodsAllowed,
    headers: object,
    body?: string,
}

type ResObj = {
    timestamp: string,
    stats: number,
    error: string,
    message: string,
    path: string,
    token: string,
};

type ResData = null | string | ResObj;

interface ReturnObj {
    err: ResData,
    data: ResObj | null | Array<any> | string | {},
}


const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';;

export async function fetchRequest(endpoint: string, method: MethodsAllowed, body: {} | null) {
    const userToken = Cookies.get("user_token");

    const ret: ReturnObj = {
        err: null,
        data: null,
    };

    // Building the request options
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    } as any;

    if (body) {
        options.body = JSON.stringify(body);
    }

    if (userToken) {
        options.headers.Authorization = `Bearer ${userToken}`;
    }

    try {
        const url = `${baseUrl}/${endpoint}`;
        const response = await fetch(url, options);

        // User not authenticated, remove jwt on cookies and send to login page
        if (response?.status === 403) {
            Cookies.remove("user_token");
            window.location.href = 'login';
            return ret;
        }

        if (!response?.ok) {
            ret.err = 'Erro no servidor';

            try {
                const errorRes = await response.json();
                ret.err = errorRes.message;
            } catch (error) {
                console.log('error to parse json');
            }

            return ret;
        }

        // Dynamically handle response based on Content-Type
        const contentType = response.headers.get("Content-Type");
        
        if (contentType?.includes("application/json")) {
            ret.data = await response.json();
        } else {
            if (response.status === 204) {
                ret.data = 'success';
                return ret;
            } 

            ret.data = await response.text();
        }

        return ret;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export default fetchRequest;