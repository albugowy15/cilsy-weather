import { createJWTToken, TokenPayload, verifyJWTToken } from "../../util/token";

describe("Test jwt", () => {
  it("check sign and verify", () => {
    const secret = "hellosecret";
    const payload = {
      id: "theid",
      email: "theemail",
    };
    const token = createJWTToken(payload, secret, "2h");
    const decoded = verifyJWTToken(token, secret);
    const decodedPayload = decoded as TokenPayload;
    expect(decodedPayload.email).toEqual(payload.email);
    expect(decodedPayload.id).toEqual(payload.id);
  });
});
