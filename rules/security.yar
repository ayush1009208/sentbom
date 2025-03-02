rule detect_hardcoded_secrets {
    strings:
        $secret1 = /password\s*=\s*['"][^'"]+['"]/
        $secret2 = /api[_]?key\s*=\s*['"][^'"]+['"]/
    condition:
        any of them
}
