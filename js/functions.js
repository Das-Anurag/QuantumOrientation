class Vector3{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    show(){
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
    length(){
        return Math.sqrt(
            this.x*this.x +
            this.y*this.y +
            this.z*this.z
        );
    }
    add(other){
        return new Vector3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }
    subtract(other){
        return new Vector3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
        );
    }
    multiplyScalar(k){
        return new Vector3(
            this.x*k,
            this.y*k,
            this.z*k
        );
    }
    dot(other){
        return this.x*other.x +
               this.y*other.y +
               this.z*other.z;
    }
    cross(other){
        return new Vector3(
            this.y*other.z - this.z*other.y,
            this.z*other.x - this.x*other.z,
            this.x*other.y - this.y*other.x
        );
    }
    normalize(){
        let len = this.length();
        if(len === 0){
            return new Vector3(0,0,0);
        }
        return new Vector3(
            this.x/len,
            this.y/len,
            this.z/len
        );
    }
}
export { Vector3 };
