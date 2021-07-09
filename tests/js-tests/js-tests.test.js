describe("#numberToFraction", () => {
  it("converts_common_decimal_to_fraction", function () {
    expect(numberToFraction(0.5)).toBe("1/2");
  });

  it("converts_common_decimal_string_to_fraction", function () {
    expect(numberToFraction("0.5")).toBe("1/2");
  });

  it("edge_case_decimal_to_fraction", function () {
    expect(numberToFraction(0.313)).toBe("313/1000");
  });

  it("returns_whole_number", function () {
    expect(numberToFraction(1)).toBe(1);
  });

  it("returns_whole_number", function () {
    expect(numberToFraction("1")).toBe(1);
  });

});
