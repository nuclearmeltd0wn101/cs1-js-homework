function SubstringSearchBM(haystack, needle)
{
    let N = haystack.length;
    let M = needle.length;
    let shift = new Array();
    for (let i = 0; i < 65536; i++)
        shift[i] = M;

    for (let i = 0; i < M; i++)
        shift[haystack.charCodeAt(i)] = M - i;

    let result = new Array();
    let i = N - 1;
    let j;
    while (i <= N)
    {
        j = M;
        k = i;
        while ((j > 0) && (needle[j] == haystack[k]))
        {
            j--;
            k--;
        }
        if (j == 0)
            result.push(k);
        if (i < N)
            i += shift[haystack[i]];
        else
            i++;
    }
    return result;
}
// todo: find mistakes
console.log(SubstringSearchBM('akekketykek', 'akek'));