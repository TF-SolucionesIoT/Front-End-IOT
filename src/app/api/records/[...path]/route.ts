import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

/**
 * Proxy para las peticiones de records
 * Reenvía las peticiones a /api/records/* al backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/api/records/${pathString}`;
    
    // Obtener los query parameters
    const searchParams = request.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;

    // Obtener el body si existe
    let body: string | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.text();
      } catch (e) {
        // No hay body
      }
    }

    // Obtener headers (incluyendo Authorization y Content-Type)
    const headers: HeadersInit = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };
    
    // Incluir Authorization si existe
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Copiar otros headers relevantes (excluyendo algunos que Next.js maneja)
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== 'host' &&
        lowerKey !== 'connection' &&
        lowerKey !== 'content-length' &&
        lowerKey !== 'authorization' && // Ya lo manejamos arriba
        lowerKey !== 'content-type' // Ya lo manejamos arriba
      ) {
        headers[key] = value;
      }
    });

    // Hacer la petición al backend
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });

    // Obtener la respuesta
    const responseData = await response.text();
    
    // Crear la respuesta con los mismos headers (excepto algunos)
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Incluir headers importantes
      if (
        key.toLowerCase() === 'content-type' ||
        key.toLowerCase() === 'content-length'
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Agregar CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error en proxy de records:', error);
    return NextResponse.json(
      { error: 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}

// Manejar OPTIONS para CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

