const getRequest = (endpoint: string): Promise<Response> =>
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })

const postRequest = (endpoint: string, data: any): Promise<Response> =>
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

export { getRequest, postRequest }
