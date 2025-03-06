type MethodsAllowed = 'POST' | 'GET' | 'PUT' | 'DELETE';

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
    data: ResData,
}

const host = 'localhost';
const port = '8080';

export async function fetchRequest(endpoint: string, method: MethodsAllowed, body: {}) {
    const ret: ReturnObj = {
        err: null,
        data: null,
    };

    // Building the request options
    const options = {
        method,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const url = `http://${host}:${port}/${endpoint}`;
        const response = await fetch(url, options);

        
        if (!response?.ok) {
            const responseJson = await response.json();

            ret.err = responseJson;
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