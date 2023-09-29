# nodejs-stream

computers always work with binary data
each number will be represented in binary format. e.g 4 => 100

## character sets

how can we represent character in binary format
first we have to conver character into number, then from number we can convert into binary format
eg: 76 is numeric representation of character L (character code)

=> how do computer know which number represents for which character ??? ==> character set

two popular character set => unicode and ascii
default javascript uses unicode character set

## character encoding

character encoding dictates how to represent a number in a character set as binary data before it can be stored in a computer
=> it dictates how many bits to use to represent the number
e.g an example of a character encoding system is UTF-8
UTF-8 states that characters should be encoded in bytes (8 bits)

`4 -> 100 -> 0000 0100`
