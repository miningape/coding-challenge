import { Controller } from "@nestjs/common";
import { MessagePattern,Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class ApiController {
    constructor(
        private appService: AppService
    ){}

    @MessagePattern( { 'data-stream': 'send' } )
    recieveData( @Payload() data: any ): string {
        console.log('Recieved: ', data);
        this.appService.setData( data );
        return 'Data Recieved';
    }
}