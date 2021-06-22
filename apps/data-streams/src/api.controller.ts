import { Controller, Logger } from "@nestjs/common";
import { MessagePattern,Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class ApiController {
    constructor(
        private appService: AppService
    ){}

    private readonly logger = new Logger();

    @MessagePattern( { 'data-stream': 'send' } )
    recieveData( @Payload() data: any ): string {
        this.logger.verbose('Recieved:\n' + data);
        this.appService.setData( data );
        return 'Data Recieved';
    }
}