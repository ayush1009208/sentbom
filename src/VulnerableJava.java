import java.io.*;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class VulnerableJava {
    // Insecure: Hardcoded encryption key
    private static final byte[] KEY = "insecurekey12345".getBytes();

    // Insecure: Unsafe deserialization
    public static Object deserializeObject(String filename) throws Exception {
        FileInputStream fis = new FileInputStream(filename);
        ObjectInputStream ois = new ObjectInputStream(fis);
        return ois.readObject();
    }

    // Insecure: Weak encryption
    public static byte[] encrypt(String data) throws Exception {
        SecretKeySpec key = new SecretKeySpec(KEY, "DES");
        Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data.getBytes());
    }

    // Insecure: Null cipher
    public static void insecureEncryption() throws Exception {
        Cipher cipher = Cipher.getInstance("NullCipher");
    }
}
