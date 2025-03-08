import Cookies from "js-cookie";

type MethodsAllowed = 'POST' | 'GET' | 'PUT' | 'DELETE';

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
};

type ResData = null | string | ResObj;

interface ReturnObj {
    err: ResData,
    data: string | null,
}

const host = 'localhost';
const port = '8080';

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
        options.headers.Authorization =  `Bearer ${userToken}`;
    }

    try {
        const url = `http://${host}:${port}/${endpoint}`;
        const response = await fetch(url, options);

        // User not authenticated, remove jwt on cookies and send to login page
        if (response?.status === 403) {
            Cookies.remove("user_token");
            window.location.href = 'login';
            return ret;
        }

        if (!response?.ok) {
            ret.err = 'Erro no servidor';
            return ret;
        }

        const resData = await response.text()

        ret.data = resData;

        return ret;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export default fetchRequest;