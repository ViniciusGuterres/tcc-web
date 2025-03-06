const host = 'localhost';
const port = '8080';

export async function fetchData(endpoint: string, options = {}) {
    const ret = {
        err: null,
        data: null,
    };

    try {
        const url = `http://${host}:${port}/${endpoint}`;        
        const response = await fetch(url, options);

        const responseJson = await response.json();

        if (!response?.ok) {
            console.log("req response: ", responseJson);

            ret.err = responseJson;
            return ret;
        }

        ret.data = responseJson;

        return ret;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export default fetchData;