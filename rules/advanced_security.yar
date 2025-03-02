rule detect_hardcoded_credentials {
    strings:
        $password = /password.*=.*["'][^"']+["']/
        $api_key = /api[_]?key.*=.*["'][^"']+["']/
        $secret = /secret.*=.*["'][^"']+["']/
    condition:
        any of them
}

rule detect_weak_crypto {
    strings:
        $weak_cipher = "createCipher"
        $weak_algo = "aes-128-ecb"
        $weak_key = /weak.*key/i
    condition:
        any of them
}

rule detect_injection_risks {
    strings:
        $sql = /SELECT.*WHERE.*\${?[^}]*}?/
        $cmd_exec = "child_process').exec"
    condition:
        any of them
}
