<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogRequests
{
   public function handle(Request $request, Closure $next)
{
    Log::debug('Request: ' . $request->method() . ' ' . $request->fullUrl() . ' - Headers: ' . json_encode($request->headers->all()));
    $response = $next($request);
    Log::debug('Response Sent: ' . $response->status() . ' - Body: ' . $response->getContent());
    return $response;
}
}